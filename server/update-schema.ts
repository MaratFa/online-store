// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { Pool } from 'pg';

// Create a new PostgreSQL client
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

async function updateSchema(): Promise<void> {
  try {
    // Add missing columns to Products table
    await pool.query(`
      ALTER TABLE "Products"
      ADD COLUMN IF NOT EXISTS "sku" VARCHAR(100) UNIQUE,
      ADD COLUMN IF NOT EXISTS "discountedPrice" DECIMAL(10, 2)
    `);

    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    // Close the connection
    await pool.end();
  }
}

// Run the function
updateSchema();
