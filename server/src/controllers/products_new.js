const { Product, Category } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
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
  const attributes = req.query.select ? req.query.select.split(',') : undefined;

  // Sort
  const order = req.query.sort 
    ? req.query.sort.split(',').map(field => [field, 'ASC'])
    : [['createdAt', 'DESC']];

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
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
exports.getProduct = asyncHandler(async (req, res, next) => {
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
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
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
exports.deleteProduct = asyncHandler(async (req, res, next) => {
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
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
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
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
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
