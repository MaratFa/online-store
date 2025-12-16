import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
const { Cart, Product } = require('../models');
import ErrorResponse from '../utils/errorResponse';
const asyncHandler = require('../middleware/async');

// @desc    Get all cart items for a user
// @route   GET /api/v1/cart
// @access  Private
exports.getCartItems = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cartItems = await Cart.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product }]
  });

  res.status(200).json({
    success: true,
    count: cartItems.length,
    data: cartItems
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }

  // Check if product is in stock
  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available.`, 400));
  }

  // Check if item already exists in cart
  const existingCartItem = await Cart.findOne({
    where: {
      userId: req.user.id,
      productId
    }
  });

  if (existingCartItem) {
    // Update quantity if item already in cart
    const newQuantity = existingCartItem.quantity + quantity;

    if (product.stock < newQuantity) {
      return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available.`, 400));
    }

    await existingCartItem.update({ quantity: newQuantity });
    return res.status(200).json({
      success: true,
      data: existingCartItem
    });
  }

  // Add new item to cart
  const cartItem = await Cart.create({
    userId: req.user.id,
    productId,
    quantity
  });

  res.status(201).json({
    success: true,
    data: cartItem
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:id
// @access  Private
exports.updateCartItem = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { quantity } = req.body;

  const cartItem = await Cart.findByPk(req.params.id);

  if (!cartItem) {
    return next(new ErrorResponse(`Cart item not found with id of ${req.params.id}`, 404));
  }

  // Check if cart item belongs to user
  if (cartItem.userId !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this cart item`, 401));
  }

  // Check product stock
  const product = await Product.findByPk(cartItem.productId);
  if (product.stock < quantity) {
    return next(new ErrorResponse(`Not enough stock. Only ${product.stock} items available.`, 400));
  }

  await cartItem.update({ quantity });

  res.status(200).json({
    success: true,
    data: cartItem
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:id
// @access  Private
exports.removeFromCart = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const cartItem = await Cart.findByPk(req.params.id);

  if (!cartItem) {
    return next(new ErrorResponse(`Cart item not found with id of ${req.params.id}`, 404));
  }

  // Check if cart item belongs to user
  if (cartItem.userId !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this cart item`, 401));
  }

  await cartItem.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Cart.destroy({
    where: { userId: req.user.id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
