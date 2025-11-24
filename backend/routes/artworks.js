const express = require('express');
const router = express.Router();
const {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getArtworksByArtist
} = require('../controllers/artworkController');
const { protect, isArtist } = require('../middleware/auth');

// Public routes - NO protect middleware
router.get('/', getAllArtworks);
router.get('/artist/:artistId', getArtworksByArtist);
router.get('/:id', getArtworkById);

// Protected routes (Artist only)
router.post('/', protect, isArtist, createArtwork);
router.put('/:id', protect, isArtist, updateArtwork);
router.delete('/:id', protect, isArtist, deleteArtwork);

module.exports = router;