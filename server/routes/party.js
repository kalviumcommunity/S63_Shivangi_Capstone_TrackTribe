const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Party = require('../models/Party.Model');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/party-covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'party-cover-' + uniqueSuffix + fileExtension);
  }
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP files are allowed.'), false);
  }
};

// Configure multer with file size limit (5MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB in bytes
  }
});

// @route   POST /api/parties
// @desc    Create a new party
// @access  Public (should be protected with auth middleware in production)
router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    const { name, genre, privacy, password, description, initialPlaylist } = req.body;

    // Validate required fields
    if (!name || !genre) {
      return res.status(400).json({
        success: false,
        message: 'Party name and genre are required'
      });
    }

    // Validate privacy and password
    if (privacy === 'private' && !password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required for private parties'
      });
    }

    // Prepare party data
    const partyData = {
      name,
      genre,
      privacy: privacy || 'public',
      description,
      initialPlaylist: initialPlaylist || 'empty',
      host: req.user?.id || '507f1f77bcf86cd799439011' // Placeholder for now - should come from auth middleware
    };

    // Add password if provided
    if (privacy === 'private' && password) {
      partyData.password = password; // In production, hash this password
    }

    // Add cover image info if uploaded
    if (req.file) {
      partyData.coverImage = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    // Create new party
    const party = new Party(partyData);
    await party.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Party created successfully',
      data: {
        id: party._id,
        name: party.name,
        genre: party.genre,
        privacy: party.privacy,
        description: party.description,
        coverImage: party.coverImage,
        createdAt: party.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating party:', error);

    // Clean up uploaded file if party creation failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    // Handle specific multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating party',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/parties/:id/cover
// @desc    Get party cover image
// @access  Public
router.get('/:id/cover', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    
    if (!party || !party.coverImage) {
      return res.status(404).json({
        success: false,
        message: 'Party cover image not found'
      });
    }

    const imagePath = path.join(uploadsDir, party.coverImage.filename);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Cover image file not found on server'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', party.coverImage.mimetype);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Send the file
    res.sendFile(imagePath);

  } catch (error) {
    console.error('Error serving cover image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving cover image'
    });
  }
});

// @route   DELETE /api/parties/:id/cover
// @desc    Delete party cover image
// @access  Private (should verify party owner)
router.delete('/:id/cover', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    
    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    if (!party.coverImage) {
      return res.status(404).json({
        success: false,
        message: 'No cover image to delete'
      });
    }

    // Delete file from filesystem
    const imagePath = path.join(uploadsDir, party.coverImage.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove cover image from database
    party.coverImage = undefined;
    await party.save();

    res.json({
      success: true,
      message: 'Cover image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting cover image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting cover image'
    });
  }
});

module.exports = router;
