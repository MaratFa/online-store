const { sequelize } = require('../models');

// @desc    Check database connection health
// @route   GET /api/v1/health
// @access  Public
exports.checkHealth = async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    // If successful, return status
    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    // If connection fails, return error
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};