import dotenv from 'dotenv';
import { sequelize, syncDb } from './src/models';
import app from './src/app';

// Load environment variables
dotenv.config({ path: './.env' });

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

// Initialize database connection
initializeDatabase();

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT: number = parseInt(process.env.PORT || '5000', 10);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel serverless functions
export default app;
