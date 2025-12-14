const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const client = new Client({
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.PG_DB || 'online_store'}'`);
    
    if (res.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE ${process.env.PG_DB || 'online_store'}`);
      console.log(`Database ${process.env.PG_DB || 'online_store'} created successfully`);
    } else {
      console.log(`Database ${process.env.PG_DB || 'online_store'} already exists`);
    }
    
    await client.end();
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();