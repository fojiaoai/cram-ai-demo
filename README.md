<!--
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-07-31 01:48:51
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-07-31 01:48:59
-->
# Cram AI Backend API

This is the backend API for Cram AI, an AI-powered content analysis platform that supports multi-source content input (video links, web URLs, file uploads) and provides comprehensive AI-powered analysis.

## Features

- File upload and analysis (images, videos, documents, text)
- Video link analysis (YouTube, Bilibili, etc.)
- Web URL content extraction and analysis
- AI-powered content processing using OpenAI APIs
- RESTful API endpoints for frontend integration

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### File Analysis
- `POST /api/analyze/file` - Upload and analyze a file
  - Accepts multipart/form-data with a file field
  - Supports images, videos, documents (PDF, DOC, DOCX), and text files

### Video Link Analysis
- `POST /api/analyze/video-link` - Analyze a video from a URL
  - Accepts JSON with a `url` field
  - Supports YouTube, Bilibili, and other video platforms

### Web URL Analysis
- `POST /api/analyze/web-url` - Analyze content from a web URL
  - Accepts JSON with a `url` field
  - Extracts and analyzes content from any web page

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/cramAI
   NODE_ENV=development
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## Integration with Frontend

The backend API is designed to be integrated with the Cram AI frontend React application. The frontend makes API calls to these endpoints to process and analyze content.

## Technologies Used

- Node.js and Express.js for the API server
- Multer for file upload handling
- OpenAI API for AI-powered content analysis
- JSDOM for web content extraction
- MongoDB for data storage (optional)
- Axios for HTTP requests