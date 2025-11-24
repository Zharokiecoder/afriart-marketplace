const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getAllConversations,
  markAsRead,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/', protect, sendMessage);
router.get('/conversations', protect, getAllConversations);
router.get('/conversation/:userId', protect, getConversation);
router.put('/read', protect, markAsRead);
router.get('/unread-count', protect, getUnreadCount);

module.exports = router;