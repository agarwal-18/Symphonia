import mongoose from 'mongoose';

const audioFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['mp3', 'wav', 'm4a', 'aac'],
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const versionSchema = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true
  },
  audioFiles: [audioFileSchema],
  description: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer', 'commenter'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  versions: [versionSchema],
  currentVersion: {
    type: Number,
    default: 1
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Get current version audio files
projectSchema.methods.getCurrentVersionFiles = function() {
  const currentVersion = this.versions.find(v => v.versionNumber === this.currentVersion);
  return currentVersion ? currentVersion.audioFiles : [];
};

export default mongoose.model('Project', projectSchema);
