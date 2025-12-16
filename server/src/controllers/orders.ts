import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
const { Order, Cart, Product } = require('../models');
import ErrorResponse from '../utils/errorResponse';
const asyncHandler = require('../middleware/async');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.findAll({
    include: [{ model: Product }]
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
exports.getOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: Product }]
  });

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Check if order belongs to user or user is admin
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
exports.createOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // Get cart items for the user
  const cartItems = await Cart.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product }]
  });

  if (cartItems.length === 0) {
    return next(new ErrorResponse(`Your cart is empty`, 400));
  }

  // Validate stock
  for (const item of cartItems) {
    if (item.Product.stock < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for ${item.Product.name}. Only ${item.Product.stock} items available.`, 400));
    }
  }

  // Calculate prices
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const itemTotal = parseFloat(item.Product.price) * item.quantity;
    itemsPrice += itemTotal;

    orderItems.push({
      productId: item.productId,
      name: item.Product.name,
      price: item.Product.price,
      quantity: item.quantity,
      image: item.Product.images[0] || ''
    });

    // Update product stock
    await item.Product.update({
      stock: item.Product.stock - item.quantity
    });
  }

  // Calculate tax and shipping
  const taxPrice = itemsPrice * 0.1; // 10% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Generate order number
  const orderNumber = `ORD-${Date.now()}`;

  // Create order
  const order = await Order.create({
    orderNumber,
    userId: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  });

  // Clear cart
  await Cart.destroy({
    where: { userId: req.user.id }
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;

  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  const updateData: any = { status };

  // Add deliveredAt date if status is 'delivered'
  if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  await order.update(updateData);

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product }]
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});
