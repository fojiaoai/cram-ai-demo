const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token format'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Account is disabled'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }

    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is provided, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }

    next();

  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

/**
 * Role-based authorization middleware
 * Requires specific role(s) to access the route
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Usage limit middleware
 * Checks if user can perform upload operations
 */
const checkUsageLimit = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user.canUpload()) {
      return res.status(429).json({
        error: 'Usage limit exceeded',
        message: `You have reached your monthly upload limit of ${user.subscription.features.maxUploadsPerMonth} files`,
        data: {
          limit: user.subscription.features.maxUploadsPerMonth,
          used: user.usage.uploadsThisMonth,
          resetDate: new Date(user.usage.lastResetDate.getFullYear(), user.usage.lastResetDate.getMonth() + 1, 1)
        }
      });
    }

    next();

  } catch (error) {
    console.error('Usage limit check error:', error);
    res.status(500).json({
      error: 'Usage check failed',
      message: 'Internal server error'
    });
  }
};

/**
 * File size limit middleware
 * Checks if uploaded file size is within user's limits
 */
const checkFileSizeLimit = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  const maxSizeBytes = req.user.subscription.features.maxFileSizeMB * 1024 * 1024;
  
  // This will be used with multer file upload
  req.fileSizeLimit = maxSizeBytes;
  
  next();
};

/**
 * Content ownership middleware
 * Ensures user can only access their own content
 */
const checkContentOwnership = async (req, res, next) => {
  try {
    const Content = require('../models/Content');
    const contentId = req.params.id || req.params.contentId;
    
    if (!contentId) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Content ID is required'
      });
    }

    const content = await Content.findById(contentId);
    
    if (!content) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Content not found'
      });
    }

    // Check if user owns the content or is admin
    if (content.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own content'
      });
    }

    // Add content to request for use in route handler
    req.content = content;
    next();

  } catch (error) {
    console.error('Content ownership check error:', error);
    res.status(500).json({
      error: 'Authorization check failed',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  auth,
  optionalAuth,
  authorize,
  checkUsageLimit,
  checkFileSizeLimit,
  checkContentOwnership
};