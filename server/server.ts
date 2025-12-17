// Load environment variables before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { sequelize, syncDb } from './src/models';
import app from './src/app';

// Initialize database connection
const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    // Sync database models
    await syncDb();
  } catch (err: any) {
    console.error('Unable to connect to the database:', err);
  }
};

// Initialize database connection and then start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    // For local development
    if (process.env.NODE_ENV !== 'production') {
      const PORT: number = parseInt(process.env.PORT || '5000', 10);
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// For Vercel serverless functions
export default app;
