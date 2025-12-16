import { Router } from 'express';
const router = Router();
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes require authentication

router
  .route('/')
  .get(getCartItems)
  .post(addToCart);

router
  .route('/:id')
  .put(updateCartItem)
  .delete(removeFromCart);

router.delete('/', clearCart);

module.exports = router;
