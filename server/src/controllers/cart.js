const { Cart, Product } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({
    where: { userId: req.user.id },
    include: [{ 
      model: Product, 
      as: 'products',
      through: { attributes: ['quantity'] }
    }]
  });
  
  if (!cart) {
    // Create a new cart if one doesn't exist
    cart = await Cart.create({
      userId: req.user.id,
      cartItems: []
    });
  }
  
  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  // Check if product exists
  const product = await Product.findByPk(productId);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }
  
  // Check if product is in stock
  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available`, 400));
  }
  
  // Find or create cart
  let cart = await Cart.findOne({ where: { userId: req.user.id } });
  
  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      cartItems: []
    });
  }
  
  // Check if product is already in cart
  const cartItems = cart.cartItems;
  const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
  
  if (existingItemIndex !== -1) {
    // Update quantity if product is already in cart
    const newQuantity = cartItems[existingItemIndex].quantity + quantity;
    
    if (newQuantity > product.stock) {
      return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available`, 400));
    }
    
    cartItems[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item to cart
    cartItems.push({
      productId,
      name: product.name,
      image: product.images[0] ? product.images[0].url : '',
      price: product.price,
      quantity
    });
  }
  
  // Update cart
  await cart.update({ cartItems });
  
  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:productId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  
  // Check if product exists
  const product = await Product.findByPk(productId);
  
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }
  
  // Check if product is in stock
  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available`, 400));
  }
  
  // Find user cart
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }
  
  // Find item in cart
  const cartItems = cart.cartItems;
  const itemIndex = cartItems.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return next(new ErrorResponse(`Product not in cart`, 404));
  }
  
  // Update quantity
  cartItems[itemIndex].quantity = quantity;
  
  // Update cart
  await cart.update({ cartItems });
  
  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  
  // Find user cart
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }
  
  // Find item in cart
  const cartItems = cart.cartItems;
  const itemIndex = cartItems.findIndex(item => item.productId === productId);
  
  if (itemIndex === -1) {
    return next(new ErrorResponse(`Product not in cart`, 404));
  }
  
  // Remove item from cart
  cartItems.splice(itemIndex, 1);
  
  // Update cart
  await cart.update({ cartItems });
  
  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  // Find user cart
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  
  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }
  
  // Clear cart
  await cart.update({ cartItems: [] });
  
  res.status(200).json({
    success: true,
    data: cart
  });
});