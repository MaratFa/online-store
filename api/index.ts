const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Initialize database connection for serverless environment
const { sequelize } = require('../server/src/models');
sequelize.authenticate().then(() => {
  console.log('Database connected successfully');
}).catch(err => {
  console.error('Unable to connect to database:', err);
  console.log('Running in demo mode without database');
});

// Import the app after loading environment variables
const app = require('../server/dist/app');

// Export the serverless handler
module.exports = (req: any, res: any) => {
  // Set NODE_ENV to production for serverless functions
  process.env.NODE_ENV = 'production';

  // Handle the request with the Express app
  return app(req, res);
};
