const express = require('express');
const Content = require('../models/Content');
const { auth, checkContentOwnership, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/content
 * @desc    Get user's content with filtering and pagination
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      search,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      userId: req.user.id
    };

    if (type) filters.type = type;
    if (status) filters['processing.status'] = status;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filters.tags = { $in: tagArray };
    }

    // Build search query
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'analysis.summary.main': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const content = await Content.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-analysis.entities -metadata.extractedText'); // Exclude large fields

    // Get total count for pagination
    const total = await Content.countDocuments(filters);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: 'Failed to get content',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/content/:id
 * @desc    Get specific content with full analysis
 * @access  Private
 */
router.get('/:id', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content; // Set by checkContentOwnership middleware

    // Increment view count
    await content.incrementViews();

    res.json({
      success: true,
      data: { content }
    });

  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      error: 'Failed to get content',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/content/:id
 * @desc    Update content metadata
 * @access  Private
 */
router.put('/:id', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content;
    const { title, description, tags, notes, rating, bookmarked } = req.body;

    // Update allowed fields
    if (title !== undefined) content.title = title.trim();
    if (description !== undefined) content.description = description.trim();
    if (tags !== undefined) {
      content.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }
    if (notes !== undefined) content.notes = notes;
    if (rating !== undefined && rating >= 1 && rating <= 5) content.rating = rating;
    if (bookmarked !== undefined) content.bookmarked = bookmarked;

    await content.save();

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: { content }
    });

  } catch (error) {
    console.error('Update content error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Failed to update content',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content
 * @access  Private
 */
router.delete('/:id', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content;

    // Clean up files if they exist
    const fs = require('fs').promises;
    
    if (content.storage.localPath) {
      try {
        await fs.unlink(content.storage.localPath);
      } catch (fileError) {
        console.warn('File cleanup warning:', fileError.message);
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

/**
 * @route   POST /api/content/:id/share
 * @desc    Create or update share settings
 * @access  Private
 */
router.post('/:id/share', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content;
    const { isShared, expiresAt, allowDownload, password } = req.body;

    // Update share settings
    content.shareSettings.isShared = isShared;
    
    if (expiresAt) {
      content.shareSettings.expiresAt = new Date(expiresAt);
    }
    
    if (allowDownload !== undefined) {
      content.shareSettings.allowDownload = allowDownload;
    }
    
    if (password) {
      const bcrypt = require('bcryptjs');
      content.shareSettings.password = await bcrypt.hash(password, 10);
    } else if (password === '') {
      content.shareSettings.password = null;
    }

    await content.save();

    // Return share info without sensitive data
    const shareInfo = {
      isShared: content.shareSettings.isShared,
      shareToken: content.shareSettings.shareToken,
      expiresAt: content.shareSettings.expiresAt,
      allowDownload: content.shareSettings.allowDownload,
      hasPassword: !!content.shareSettings.password
    };

    res.json({
      success: true,
      message: 'Share settings updated successfully',
      data: { shareSettings: shareInfo }
    });

  } catch (error) {
    console.error('Update share settings error:', error);
    res.status(500).json({
      error: 'Failed to update share settings',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/content/shared/:token
 * @desc    Access shared content by token
 * @access  Public
 */
router.get('/shared/:token', optionalAuth, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.query;

    const content = await Content.findOne({
      'shareSettings.shareToken': token,
      'shareSettings.isShared': true
    }).populate('userId', 'username avatar');

    if (!content) {
      return res.status(404).json({
        error: 'Content not found',
        message: 'Shared content not found or no longer available'
      });
    }

    // Check if share has expired
    if (content.shareSettings.expiresAt && content.shareSettings.expiresAt < new Date()) {
      return res.status(410).json({
        error: 'Share expired',
        message: 'This shared content has expired'
      });
    }

    // Check password if required
    if (content.shareSettings.password) {
      if (!password) {
        return res.status(401).json({
          error: 'Password required',
          message: 'This shared content is password protected',
          requiresPassword: true
        });
      }

      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, content.shareSettings.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid password',
          message: 'Incorrect password for shared content'
        });
      }
    }

    // Increment view count
    await content.incrementViews();

    // Remove sensitive information
    const sharedContent = content.toObject();
    delete sharedContent.shareSettings.password;
    delete sharedContent.shareSettings.shareToken;

    res.json({
      success: true,
      data: { 
        content: sharedContent,
        owner: {
          username: content.userId.username,
          avatar: content.userId.avatar
        }
      }
    });

  } catch (error) {
    console.error('Get shared content error:', error);
    res.status(500).json({
      error: 'Failed to get shared content',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/content/stats/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get content counts by status
    const statusStats = await Content.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$processing.status', count: { $sum: 1 } } }
    ]);

    // Get content counts by type
    const typeStats = await Content.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Content.find({
      userId: userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).limit(10).select('title type processing.status createdAt');

    // Get total views
    const totalViews = await Content.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Format statistics
    const stats = {
      totalContent: await Content.countDocuments({ userId }),
      statusBreakdown: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      typeBreakdown: typeStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      totalViews: totalViews[0]?.totalViews || 0,
      recentActivity
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/content/:id/export
 * @desc    Export content analysis
 * @access  Private
 */
router.get('/:id/export', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content;
    const { format = 'json' } = req.query;

    // Prepare export data
    const exportData = {
      title: content.title,
      description: content.description,
      type: content.type,
      createdAt: content.createdAt,
      analysis: content.analysis,
      metadata: {
        ...content.metadata,
        extractedText: undefined // Exclude raw text from export
      },
      tags: content.tags,
      rating: content.rating,
      notes: content.notes
    };

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${content.title}-analysis.json"`);
      res.json(exportData);
    } else if (format === 'txt') {
      // Create text format
      let textContent = `${content.title}\n`;
      textContent += `${'='.repeat(content.title.length)}\n\n`;
      textContent += `类型: ${content.type}\n`;
      textContent += `创建时间: ${content.createdAt.toLocaleString('zh-CN')}\n\n`;
      
      if (content.analysis?.summary?.main) {
        textContent += `摘要:\n${content.analysis.summary.main}\n\n`;
      }
      
      if (content.analysis?.insights?.length > 0) {
        textContent += `关键洞察:\n`;
        content.analysis.insights.forEach((insight, index) => {
          textContent += `${index + 1}. ${insight.title}: ${insight.content}\n`;
        });
        textContent += '\n';
      }

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${content.title}-analysis.txt"`);
      res.send(textContent);
    } else {
      return res.status(400).json({
        error: 'Invalid format',
        message: 'Supported formats: json, txt'
      });
    }

  } catch (error) {
    console.error('Export content error:', error);
    res.status(500).json({
      error: 'Failed to export content',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/content/:id/reprocess
 * @desc    Reprocess content analysis
 * @access  Private
 */
router.post('/:id/reprocess', auth, checkContentOwnership, async (req, res) => {
  try {
    const content = req.content;

    // Check if content can be reprocessed
    if (content.processing.status === 'processing') {
      return res.status(409).json({
        error: 'Already processing',
        message: 'Content is currently being processed'
      });
    }

    // Reset processing status
    content.processing.status = 'pending';
    content.processing.progress = 0;
    content.processing.stages = [];
    content.processing.startedAt = null;
    content.processing.completedAt = null;
    content.processing.errorMessage = null;

    await content.save();

    // Start reprocessing
    const { processContent } = require('../services/contentProcessor');
    processContent(content.id).catch(error => {
      console.error('Reprocessing error:', error);
    });

    res.json({
      success: true,
      message: 'Content reprocessing started',
      data: {
        id: content.id,
        status: content.processing.status
      }
    });

  } catch (error) {
    console.error('Reprocess content error:', error);
    res.status(500).json({
      error: 'Failed to reprocess content',
      message: 'Internal server error'
    });
  }
});

module.exports = router;