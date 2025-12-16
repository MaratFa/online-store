import { Client } from 'pg';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

async function setupDatabase(): Promise<void> {
  const client = new Client({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const dbName = process.env.PG_DB || 'online_store';
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

    if (res.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    await client.end();
  } catch (err: any) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();
