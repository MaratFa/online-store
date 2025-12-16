import { Router } from 'express';
const router = Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getUserOrders
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All order routes require authentication

router
  .route('/')
  .get(authorize('admin'), getOrders)
  .post(createOrder);

router.get('/myorders', getUserOrders);

router
  .route('/:id')
  .get(getOrder)
  .put(authorize('admin'), updateOrderStatus);

module.exports = router;
