import { Request, Response } from 'express';
const { sequelize } = require('../models');

exports.checkHealth = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await sequelize.authenticate();

    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
