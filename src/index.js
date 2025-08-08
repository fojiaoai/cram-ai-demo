const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// File upload and analysis endpoint
app.post('/api/analyze/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    // Process the file based on its type
    let analysisResult;
    
    if (fileType.startsWith('image/')) {
      analysisResult = await analyzeImage(filePath);
    } else if (fileType.startsWith('video/')) {
      analysisResult = await analyzeVideo(filePath);
    } else if (fileType === 'application/pdf' || 
               fileType === 'application/msword' || 
               fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      analysisResult = await analyzeDocument(filePath, fileType);
    } else if (fileType.startsWith('text/')) {
      analysisResult = await analyzeText(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.status(200).json({
      success: true,
      fileName,
      fileType,
      result: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing file:', error);
    res.status(500).json({ error: 'Failed to analyze file', details: error.message });
  }
});

// Video link analysis endpoint
app.post('/api/analyze/video-link', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'No video URL provided' });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Extract video information and analyze
    const analysisResult = await analyzeVideoLink(url);
    
    res.status(200).json({
      success: true,
      url,
      result: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing video link:', error);
    res.status(500).json({ error: 'Failed to analyze video link', details: error.message });
  }
});

// Web URL analysis endpoint
app.post('/api/analyze/web-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'No web URL provided' });
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Extract web content and analyze
    const analysisResult = await analyzeWebUrl(url);
    
    res.status(200).json({
      success: true,
      url,
      result: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing web URL:', error);
    res.status(500).json({ error: 'Failed to analyze web URL', details: error.message });
  }
});

// Helper functions

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Analyze image using OpenAI Vision API
async function analyzeImage(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and provide a detailed description, key elements, and any text content visible in the image." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    return {
      summary: response.choices[0].message.content,
      keyInsights: extractKeyInsights(response.choices[0].message.content),
      type: 'image'
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
}

// Analyze video (simplified mock implementation)
async function analyzeVideo(filePath) {
  // In a real implementation, this would use a video processing service
  // For now, we'll return mock data
  return {
    summary: "This is a video analysis summary. In a production environment, we would extract frames, analyze audio, and provide a comprehensive analysis.",
    keyInsights: [
      "Key visual elements detected",
      "Audio transcription and analysis",
      "Scene detection and segmentation",
      "Key moments identified"
    ],
    duration: "00:05:23",
    type: 'video'
  };
}

// Analyze document (PDF, DOC, DOCX)
async function analyzeDocument(filePath, fileType) {
  // In a real implementation, this would extract text from documents
  // For now, we'll return mock data
  return {
    summary: "This is a document analysis summary. In a production environment, we would extract text, analyze structure, and provide a comprehensive analysis.",
    keyInsights: [
      "Document structure analyzed",
      "Key topics identified",
      "Main arguments extracted",
      "References and citations detected"
    ],
    pageCount: 5,
    type: 'document'
  };
}

// Analyze text file
async function analyzeText(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes text content. Provide a summary, key insights, main topics, and sentiment analysis."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 1000,
    });

    return {
      summary: response.choices[0].message.content,
      keyInsights: extractKeyInsights(response.choices[0].message.content),
      type: 'text'
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text');
  }
}

// Analyze video link
async function analyzeVideoLink(url) {
  // In a real implementation, this would extract video information from platforms like YouTube
  // For now, we'll return mock data
  return {
    title: "Sample Video Title",
    channel: "Sample Channel",
    duration: "10:15",
    summary: "This is a video analysis summary. In a production environment, we would extract video metadata, analyze content, and provide a comprehensive analysis.",
    keyInsights: [
      "Key topics covered in the video",
      "Main arguments presented",
      "Visual elements and demonstrations",
      "Audience engagement metrics"
    ],
    transcript: "This is a sample transcript of the video content...",
    type: 'video'
  };
}

// Analyze web URL
async function analyzeWebUrl(url) {
  try {
    const axios = require('axios');
    const { JSDOM } = require('jsdom');
    
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract title, description, and main content
    const title = document.querySelector('title')?.textContent || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Extract main content (simplified approach)
    const bodyText = document.body.textContent.trim();
    const cleanText = bodyText.replace(/\s+/g, ' ').substring(0, 5000); // Limit text size
    
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes web content. Provide a summary, key insights, main topics, and content structure analysis."
        },
        {
          role: "user",
          content: `URL: ${url}\nTitle: ${title}\nDescription: ${description}\nContent: ${cleanText}`
        }
      ],
      max_tokens: 1000,
    });

    return {
      url,
      title,
      description,
      summary: aiResponse.choices[0].message.content,
      keyInsights: extractKeyInsights(aiResponse.choices[0].message.content),
      type: 'web'
    };
  } catch (error) {
    console.error('Error analyzing web URL:', error);
    throw new Error('Failed to analyze web URL');
  }
}

// Extract key insights from AI response
function extractKeyInsights(text) {
  // Simple extraction logic - in a real implementation, this would be more sophisticated
  const insights = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes('•') || line.includes('-') || line.includes('*')) {
      const insight = line.replace(/^[•\-*]\s*/, '').trim();
      if (insight && insight.length > 10) {
        insights.push(insight);
      }
    }
  }
  
  // If no bullet points found, try to extract sentences
  if (insights.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    for (let i = 0; i < Math.min(5, sentences.length); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length > 10) {
        insights.push(sentence);
      }
    }
  }
  
  return insights.slice(0, 5); // Return up to 5 insights
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});