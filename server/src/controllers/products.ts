import { Request, Response, NextFunction } from 'express';
const { Product, Category } = require('../models');
import ErrorResponse from '../utils/errorResponse';
const asyncHandler = require('../middleware/async');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // Return mock data if database is not connected
  if (process.env.VERCEL) {
    const mockProducts = require('../../../client/src/data/mocks').mockProducts;
    return res.status(200).json({
      success: true,
      count: mockProducts.length,
      data: mockProducts
    });
  }

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'category'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/(gt|gte|lt|lte|in)/g, match => `$${match}`);

  // Build where clause
  let whereClause = JSON.parse(queryStr);

  // Filter by category if provided
  if (req.query.category) {
    const category = await Category.findOne({ where: { name: req.query.category } });
    if (category) {
      whereClause.categoryId = category.id;
    }
  }

  // Select Fields
  const attributes = req.query.select ? (req.query.select as string).split(',') : undefined;

  // Sort
  const order = req.query.sort
    ? (req.query.sort as string).split(',').map(field => [field, 'ASC'])
    : [['createdAt', 'DESC']];

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  // Executing query
  const products = await Product.findAll({
    where: whereClause,
    include: [{ model: Category }],
    attributes,
    order,
    limit,
    offset
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Category, as: 'category' }]
  });

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  product = await product.update(req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  await product.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.findAll({
    where: { featured: true },
    include: [{ model: Category, as: 'category' }],
    limit: 8
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by category
// @route   GET /api/v1/products/category/:categoryId
// @access  Public
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.findAll({
    where: { categoryId: req.params.categoryId },
    include: [{ model: Category, as: 'category' }]
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory
};
