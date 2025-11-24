const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  processPayment,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

// All order routes require authentication
router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.post('/payment', protect, processPayment);

// Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;