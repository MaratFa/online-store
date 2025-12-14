const express = require('express');
const router = express.Router();
const {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, createOrder);

router
  .route('/user')
  .get(protect, getUserOrders);

router
  .route('/:id')
  .get(protect, getOrder);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

router
  .route('/:id/pay')
  .put(protect, updateOrderToPaid);

router
  .route('/:id/cancel')
  .put(protect, cancelOrder);

module.exports = router;