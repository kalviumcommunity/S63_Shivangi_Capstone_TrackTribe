const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  genre: {
    type: String,
    required: true,
    enum: ['Electronic', 'House', 'Techno', 'Trance', 'Drum & Bass', 'Hip-Hop', 'Pop', 'Mixed']
  },
  privacy: {
    type: String,
    required: true,
    enum: ['public', 'private'],
    default: 'public'
  },
  password: {
    type: String,
    required: function() {
      return this.privacy === 'private';
    }
  },
  description: {
    type: String,
    maxlength: 500
  },
  initialPlaylist: {
    type: String,
    enum: ['empty', 'spotify', 'youtube', 'soundcloud'],
    default: 'empty'
  },
  coverImage: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
partySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Party', partySchema);
