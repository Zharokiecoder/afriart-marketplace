const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Artwork = require('../models/Artwork');

// Get all artists - PUBLIC ROUTE
router.get('/', async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' }).select('-password');
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist profile and their artworks - PUBLIC ROUTE
router.get('/:id', async (req, res) => {
  try {
    const artist = await User.findById(req.params.id).select('-password');
    
    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const artworks = await Artwork.find({ artist: req.params.id });

    res.json({
      artist,
      artworks,
      totalArtworks: artworks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;