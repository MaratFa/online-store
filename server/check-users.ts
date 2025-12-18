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

async function checkUsers(): Promise<void> {
  try {
    // Get all users
    const userResult = await pool.query('SELECT id, name, email, role FROM "Users"');

    console.log('Users in the database:');
    userResult.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    // Close the connection
    await pool.end();
  }
}

// Run the function
checkUsers();
