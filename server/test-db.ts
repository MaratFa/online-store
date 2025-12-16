import { sequelize } from './src/models';

async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    // Test a simple query
    const [results, metadata] = await sequelize.query('SELECT 1+1 AS result');
    console.log('Test query result:', (results as any)[0]);

    // Check if tables exist
    const tables: string[] = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables in database:', tables);

    await sequelize.close();
  } catch (error: any) {
    console.error('Unable to connect to database:', error);
  }
}

testDatabaseConnection();
