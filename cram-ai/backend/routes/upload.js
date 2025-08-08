const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const ytdl = require('ytdl-core');
const cheerio = require('cheerio');

const Content = require('../models/Content');
const { auth, checkUsageLimit, checkFileSizeLimit } = require('../middleware/auth');
const { processContent } = require('../services/contentProcessor');
const { uploadToS3 } = require('../services/s3Service');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'md',
    'mp4', 'avi', 'mov', 'wmv', 'mkv',
    'jpg', 'jpeg', 'png', 'gif', 'webp'
  ];
  
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${fileExtension} is not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB default
    files: 5 // Maximum 5 files per request
  }
});

/**
 * @route   POST /api/upload/file
 * @desc    Upload files for analysis
 * @access  Private
 */
router.post('/file', auth, checkUsageLimit, checkFileSizeLimit, upload.array('files', 5), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one file to upload'
      });
    }

    const uploadedContent = [];
    const errors = [];

    for (const file of files) {
      try {
        // Check individual file size against user limit
        const maxSizeBytes = req.user.subscription.features.maxFileSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          errors.push({
            filename: file.originalname,
            error: `File size exceeds limit of ${req.user.subscription.features.maxFileSizeMB}MB`
          });
          continue;
        }

        // Determine content type
        const fileExtension = path.extname(file.originalname).toLowerCase();
        let contentType = 'document';
        
        if (['.mp4', '.avi', '.mov', '.wmv', '.mkv'].includes(fileExtension)) {
          contentType = 'video';
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
          contentType = 'image';
        } else if (['.mp3', '.wav', '.m4a', '.aac'].includes(fileExtension)) {
          contentType = 'audio';
        }

        // Create content record
        const content = new Content({
          userId: req.user.id,
          title: title || file.originalname,
          description: description || '',
          type: contentType,
          source: {
            type: 'upload',
            originalFilename: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size
          },
          storage: {
            localPath: file.path
          },
          metadata: {
            language: 'zh-CN'
          },
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          processing: {
            status: 'pending',
            stages: []
          }
        });

        await content.save();

        // Upload to S3 if configured
        if (process.env.AWS_S3_BUCKET) {
          try {
            const s3Result = await uploadToS3(file.path, file.filename, file.mimetype);
            content.storage.s3Key = s3Result.Key;
            content.storage.s3Bucket = s3Result.Bucket;
            await content.save();
          } catch (s3Error) {
            console.error('S3 upload error:', s3Error);
            // Continue without S3 - file is still stored locally
          }
        }

        // Start processing in background
        processContent(content.id).catch(error => {
          console.error('Content processing error:', error);
        });

        // Increment user usage
        await req.user.incrementUsage();

        uploadedContent.push({
          id: content.id,
          title: content.title,
          type: content.type,
          status: content.processing.status,
          filename: file.originalname,
          size: file.size
        });

      } catch (fileError) {
        console.error('File processing error:', fileError);
        errors.push({
          filename: file.originalname,
          error: fileError.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `${uploadedContent.length} file(s) uploaded successfully`,
      data: {
        uploaded: uploadedContent,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('File upload error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'File size exceeds the maximum allowed limit'
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({
        error: 'Too many files',
        message: 'Maximum 5 files allowed per upload'
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/upload/video-url
 * @desc    Process video URL for analysis
 * @access  Private
 */
router.post('/video-url', auth, checkUsageLimit, async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'URL required',
        message: 'Video URL is required'
      });
    }

    // Validate URL format
    let videoUrl;
    try {
      videoUrl = new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid video URL'
      });
    }

    // Determine video platform
    let platform = 'unknown';
    let videoId = null;

    if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
      platform = 'youtube';
      if (ytdl.validateURL(url)) {
        try {
          const info = await ytdl.getInfo(url);
          videoId = info.videoDetails.videoId;
        } catch (ytdlError) {
          return res.status(400).json({
            error: 'Invalid YouTube URL',
            message: 'Unable to process this YouTube video'
          });
        }
      } else {
        return res.status(400).json({
          error: 'Invalid YouTube URL',
          message: 'Please provide a valid YouTube video URL'
        });
      }
    } else if (videoUrl.hostname.includes('bilibili.com')) {
      platform = 'bilibili';
      // Extract Bilibili video ID from URL
      const bvMatch = url.match(/\/video\/(BV\w+)/);
      if (bvMatch) {
        videoId = bvMatch[1];
      }
    } else if (videoUrl.hostname.includes('vimeo.com')) {
      platform = 'vimeo';
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        videoId = vimeoMatch[1];
      }
    }

    // Get video metadata
    let videoTitle = title;
    let videoDuration = null;
    let thumbnailUrl = null;

    if (platform === 'youtube' && videoId) {
      try {
        const info = await ytdl.getInfo(url);
        videoTitle = videoTitle || info.videoDetails.title;
        videoDuration = parseInt(info.videoDetails.lengthSeconds);
        thumbnailUrl = info.videoDetails.thumbnails?.[0]?.url;
      } catch (metadataError) {
        console.error('YouTube metadata error:', metadataError);
      }
    }

    // Create content record
    const content = new Content({
      userId: req.user.id,
      title: videoTitle || `Video from ${platform}`,
      description: description || '',
      type: 'video',
      source: {
        type: platform,
        url: url
      },
      metadata: {
        duration: videoDuration,
        language: 'zh-CN'
      },
      storage: {
        thumbnailUrl
      },
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      processing: {
        status: 'pending',
        stages: []
      }
    });

    await content.save();

    // Start processing in background
    processContent(content.id).catch(error => {
      console.error('Video processing error:', error);
    });

    // Increment user usage
    await req.user.incrementUsage();

    res.status(201).json({
      success: true,
      message: 'Video URL submitted for analysis',
      data: {
        content: {
          id: content.id,
          title: content.title,
          type: content.type,
          platform,
          status: content.processing.status,
          url: url
        }
      }
    });

  } catch (error) {
    console.error('Video URL processing error:', error);
    res.status(500).json({
      error: 'Video processing failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/upload/web-url
 * @desc    Process web URL for analysis
 * @access  Private
 */
router.post('/web-url', auth, checkUsageLimit, async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'URL required',
        message: 'Web URL is required'
      });
    }

    // Validate URL format
    let webUrl;
    try {
      webUrl = new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        error: 'Invalid URL',
        message: 'Please provide a valid web URL'
      });
    }

    // Basic web scraping to get page title and metadata
    let pageTitle = title;
    let pageDescription = description;
    let wordCount = 0;

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CramAI/1.0; +https://cram-ai.com)'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract title
      if (!pageTitle) {
        pageTitle = $('title').text().trim() || 
                   $('meta[property="og:title"]').attr('content') || 
                   $('h1').first().text().trim();
      }

      // Extract description
      if (!pageDescription) {
        pageDescription = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || 
                         $('p').first().text().trim().substring(0, 200);
      }

      // Estimate word count
      const textContent = $('body').text().replace(/\s+/g, ' ').trim();
      wordCount = textContent.split(' ').length;

    } catch (scrapingError) {
      console.error('Web scraping error:', scrapingError);
      // Continue with provided title/description
    }

    // Create content record
    const content = new Content({
      userId: req.user.id,
      title: pageTitle || `Web page from ${webUrl.hostname}`,
      description: pageDescription || '',
      type: 'web',
      source: {
        type: 'web_url',
        url: url
      },
      metadata: {
        wordCount,
        language: 'zh-CN'
      },
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      processing: {
        status: 'pending',
        stages: []
      }
    });

    await content.save();

    // Start processing in background
    processContent(content.id).catch(error => {
      console.error('Web content processing error:', error);
    });

    // Increment user usage
    await req.user.incrementUsage();

    res.status(201).json({
      success: true,
      message: 'Web URL submitted for analysis',
      data: {
        content: {
          id: content.id,
          title: content.title,
          type: content.type,
          status: content.processing.status,
          url: url,
          wordCount
        }
      }
    });

  } catch (error) {
    console.error('Web URL processing error:', error);
    res.status(500).json({
      error: 'Web processing failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/upload/progress/:id
 * @desc    Get upload/processing progress
 * @access  Private
 */
router.get('/progress/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!content) {
      return res.status(404).json({
        error: 'Content not found',
        message: 'Content not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        id: content.id,
        title: content.title,
        status: content.processing.status,
        progress: content.processing.progress,
        stages: content.processing.stages,
        startedAt: content.processing.startedAt,
        completedAt: content.processing.completedAt,
        errorMessage: content.processing.errorMessage
      }
    });

  } catch (error) {
    console.error('Progress check error:', error);
    res.status(500).json({
      error: 'Failed to get progress',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/upload/:id
 * @desc    Cancel upload/processing or delete content
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!content) {
      return res.status(404).json({
        error: 'Content not found',
        message: 'Content not found or access denied'
      });
    }

    // If processing, mark as cancelled
    if (content.processing.status === 'processing' || content.processing.status === 'pending') {
      content.processing.status = 'cancelled';
      content.processing.completedAt = new Date();
      await content.save();
    }

    // Clean up files
    if (content.storage.localPath) {
      try {
        await fs.unlink(content.storage.localPath);
      } catch (fileError) {
        console.error('File cleanup error:', fileError);
      }
    }

    // Delete from database
    await Content.findByIdAndDelete(content.id);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      error: 'Failed to delete content',
      message: 'Internal server error'
    });
  }
});

module.exports = router;