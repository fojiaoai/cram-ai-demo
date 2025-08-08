const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['video', 'document', 'web', 'image', 'audio'],
    required: true
  },
  source: {
    type: {
      type: String,
      enum: ['upload', 'youtube', 'bilibili', 'vimeo', 'web_url'],
      required: true
    },
    url: {
      type: String,
      default: null
    },
    originalFilename: {
      type: String,
      default: null
    },
    mimeType: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: 0
    }
  },
  storage: {
    s3Key: {
      type: String,
      default: null
    },
    s3Bucket: {
      type: String,
      default: null
    },
    localPath: {
      type: String,
      default: null
    },
    thumbnailUrl: {
      type: String,
      default: null
    }
  },
  metadata: {
    duration: {
      type: Number, // in seconds for video/audio
      default: null
    },
    dimensions: {
      width: Number,
      height: Number
    },
    pageCount: {
      type: Number, // for documents
      default: null
    },
    wordCount: {
      type: Number,
      default: null
    },
    language: {
      type: String,
      default: 'zh-CN'
    },
    extractedText: {
      type: String,
      default: null
    }
  },
  processing: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    errorMessage: {
      type: String,
      default: null
    },
    stages: [{
      name: String,
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed']
      },
      startedAt: Date,
      completedAt: Date,
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    }]
  },
  analysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    summary: {
      main: {
        type: String,
        default: null
      },
      keyPoints: [{
        type: String
      }],
      wordCount: {
        type: Number,
        default: 0
      }
    },
    insights: [{
      type: {
        type: String,
        enum: ['trend', 'opportunity', 'challenge', 'innovation', 'risk', 'recommendation']
      },
      title: String,
      content: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      impact: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      category: String,
      tags: [String]
    }],
    topics: [{
      name: String,
      relevance: {
        type: Number,
        min: 0,
        max: 100
      },
      category: String,
      mentions: Number
    }],
    sentiment: {
      overall: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'mixed']
      },
      score: {
        type: Number,
        min: -1,
        max: 1
      },
      breakdown: {
        positive: {
          type: Number,
          min: 0,
          max: 100
        },
        negative: {
          type: Number,
          min: 0,
          max: 100
        },
        neutral: {
          type: Number,
          min: 0,
          max: 100
        }
      },
      emotions: [{
        emotion: String,
        score: {
          type: Number,
          min: 0,
          max: 100
        }
      }]
    },
    entities: [{
      name: String,
      type: {
        type: String,
        enum: ['person', 'organization', 'location', 'product', 'concept', 'date', 'money']
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      mentions: Number,
      context: [String]
    }],
    keyQuotes: [{
      text: String,
      timestamp: String, // for video/audio content
      speaker: String,
      context: String,
      importance: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    actionItems: [{
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent']
      },
      category: String,
      action: String,
      timeline: String,
      assignee: String,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
      }
    }],
    relatedContent: [{
      title: String,
      type: String,
      url: String,
      relevance: {
        type: Number,
        min: 0,
        max: 100
      },
      source: String
    }]
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  shareSettings: {
    isShared: {
      type: Boolean,
      default: false
    },
    shareToken: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    allowDownload: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: null
    }
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date,
    default: null
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
contentSchema.index({ userId: 1, createdAt: -1 });
contentSchema.index({ 'processing.status': 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ 'analysis.topics.name': 1 });
contentSchema.index({ title: 'text', 'analysis.summary.main': 'text' });

// Virtual for processing duration
contentSchema.virtual('processingDuration').get(function() {
  if (this.processing.startedAt && this.processing.completedAt) {
    return this.processing.completedAt - this.processing.startedAt;
  }
  return null;
});

// Virtual for file size in human readable format
contentSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.source.fileSize;
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Method to update processing status
contentSchema.methods.updateProcessingStatus = function(status, progress = null, errorMessage = null) {
  this.processing.status = status;
  
  if (progress !== null) {
    this.processing.progress = progress;
  }
  
  if (status === 'processing' && !this.processing.startedAt) {
    this.processing.startedAt = new Date();
  }
  
  if (status === 'completed' || status === 'failed') {
    this.processing.completedAt = new Date();
    this.processing.progress = status === 'completed' ? 100 : this.processing.progress;
  }
  
  if (errorMessage) {
    this.processing.errorMessage = errorMessage;
  }
  
  return this.save();
};

// Method to add processing stage
contentSchema.methods.addProcessingStage = function(name, status = 'pending') {
  this.processing.stages.push({
    name,
    status,
    startedAt: status === 'processing' ? new Date() : null,
    progress: 0
  });
  return this.save();
};

// Method to update processing stage
contentSchema.methods.updateProcessingStage = function(stageName, status, progress = null) {
  const stage = this.processing.stages.find(s => s.name === stageName);
  if (stage) {
    stage.status = status;
    if (progress !== null) stage.progress = progress;
    if (status === 'processing' && !stage.startedAt) stage.startedAt = new Date();
    if (status === 'completed' || status === 'failed') stage.completedAt = new Date();
  }
  return this.save();
};

// Method to increment view count
contentSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Static method to find content by user with filters
contentSchema.statics.findByUserWithFilters = function(userId, filters = {}) {
  const query = { userId };
  
  if (filters.type) query.type = filters.type;
  if (filters.status) query['processing.status'] = filters.status;
  if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50)
    .skip(filters.skip || 0);
};

// Pre-save middleware to generate share token if needed
contentSchema.pre('save', function(next) {
  if (this.shareSettings.isShared && !this.shareSettings.shareToken) {
    const crypto = require('crypto');
    this.shareSettings.shareToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Content', contentSchema);