const dotenv = require('dotenv');
const { sequelize, syncDb } = require('./src/models');
const app = require('./src/app');

// Load environment variables
dotenv.config({ path: './.env' });

// Log environment variables for debugging
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
console.log('PG_DB:', process.env.PG_DB);
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_PORT:', process.env.PG_PORT);

// Connect to database and sync models
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected');
    // Sync database models
    syncDb();
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});