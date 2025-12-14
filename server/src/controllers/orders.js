const { Order, Cart, Product } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
  });
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get user orders
// @route   GET /api/v1/orders/user
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id }
  });
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
  });
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is order owner or admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to access this order`, 401));
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { 
    shippingAddress, 
    paymentMethod,
    taxPrice,
    shippingPrice
  } = req.body;
  
  // Get user cart
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  
  if (!cart || cart.cartItems.length === 0) {
    return next(new ErrorResponse(`No items in cart`, 400));
  }
  
  // Check if all products are in stock
  for (const item of cart.cartItems) {
    const product = await Product.findByPk(item.productId);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.productId}`, 404));
    }
    
    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for ${product.name}. Only ${product.stock} items available`, 400));
    }
  }
  
  // Calculate total price
  const itemsPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
  // Create order
  const order = await Order.create({
    userId: req.user.id,
    orderItems: cart.cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod === 'PayPal' ? true : false,
    paidAt: paymentMethod === 'PayPal' ? new Date() : null,
    status: 'Processing'
  });
  
  // Update product stock and sold count
  for (const item of cart.cartItems) {
    const product = await Product.findByPk(item.productId);
    
    await product.update({
      stock: product.stock - item.quantity,
      sold: product.sold + item.quantity
    });
  }
  
  // Clear cart
  await cart.update({ cartItems: [] });
  
  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  let order = await Order.findByPk(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  order = await order.update({ status });
  
  // Update deliveredAt if status is Delivered
  if (status === 'Delivered') {
    await order.update({ 
      isDelivered: true,
      deliveredAt: new Date()
    });
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const { paymentResult } = req.body;
  
  let order = await Order.findByPk(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is order owner
  if (order.userId !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this order`, 401));
  }
  
  order = await order.update({
    isPaid: true,
    paidAt: new Date(),
    paymentResult
  });
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findByPk(req.params.id);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }
  
  // Make sure user is order owner or admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to cancel this order`, 401));
  }
  
  // Only allow cancellation if order is not delivered
  if (order.status === 'Delivered') {
    return next(new ErrorResponse(`Cannot cancel a delivered order`, 400));
  }
  
  // If order is already paid, you would typically process a refund here
  // For now, we'll just update the status
  order = await order.update({ status: 'Cancelled' });
  
  // Restore product stock and sold count
  for (const item of order.orderItems) {
    const product = await Product.findByPk(item.productId);
    
    if (product) {
      await product.update({
        stock: product.stock + item.quantity,
        sold: product.sold - item.quantity
      });
    }
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});