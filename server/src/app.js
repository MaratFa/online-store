const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const products = require('./routes/products');
const categories = require('./routes/categories');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const { checkHealth } = require('./routes/health');

const app = express();

// Trust proxy for rate limiting when behind a proxy (like in development)
app.set('trust proxy', 1);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Store API is running',
    version: 'v1',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders'
    }
  });
});

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/products', products);
app.use('/api/v1/categories', categories);
app.use('/api/v1/cart', cart);
app.use('/api/v1/orders', orders);
app.get('/api/v1/health', checkHealth);

// Error handler middleware
app.use(errorHandler);

module.exports = app;