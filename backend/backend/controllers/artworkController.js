const Artwork = require('../models/Artwork');

// Get all artworks
exports.getAllArtworks = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, featured } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const artworks = await Artwork.find(filter)
      .populate('artist', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single artwork
exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name email avatar');

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Increment views
    artwork.views += 1;
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create artwork (Artist only)
exports.createArtwork = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      images,
      dimensions,
      medium,
      year,
      tags
    } = req.body;

    const artwork = await Artwork.create({
      title,
      description,
      category,
      price,
      images,
      dimensions,
      medium,
      year,
      tags,
      artist: req.user._id
    });

    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update artwork
exports.updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if user is the artist or admin
    if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this artwork' });
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete artwork
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if user is the artist or admin
    if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this artwork' });
    }

    await artwork.deleteOne();
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get artworks by artist
exports.getArtworksByArtist = async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.params.artistId })
      .populate('artist', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};