const express = require('express');
const router = express.Router();

// Cart will be handled on frontend with localStorage
// This is a placeholder for future server-side cart implementation

router.get('/', (req, res) => {
  res.json({ message: 'Cart handled on client side' });
});

module.exports = router;