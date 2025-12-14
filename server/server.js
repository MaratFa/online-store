const dotenv = require('dotenv');
const { sequelize, syncDb } = require('./src/models');
const app = require('./src/app');

// Load environment variables
dotenv.config({ path: './.env' });

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    // Sync database models
    await syncDb();
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

// Initialize database connection
initializeDatabase();

// For Vercel serverless functions
module.exports = app;