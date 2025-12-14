const dotenv = require('dotenv');
const { sequelize, syncDb } = require('./src/models');
const app = require('./src/app');

// Load environment variables
dotenv.config({ path: './.env' });


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