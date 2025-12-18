// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Create a new PostgreSQL client
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

async function seedUsers(): Promise<void> {
  try {
    // Check if users already exist
    const userResult = await pool.query('SELECT COUNT(*) FROM "Users"');
    const userCount = parseInt(userResult.rows[0].count);

    if (userCount === 0) {
      console.log('No users found. Creating default users...');

      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO "Users" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ('Admin User', 'admin@example.com', $1, 'admin', NOW(), NOW())
      `, [adminPassword]);

      // Create regular user
      const userPassword = await bcrypt.hash('user123', 10);
      await pool.query(`
        INSERT INTO "Users" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ('John Doe', 'user@example.com', $1, 'user', NOW(), NOW())
      `, [userPassword]);

      console.log('Default users created successfully');
    } else {
      console.log(`Found ${userCount} users in the database`);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    // Close the connection
    await pool.end();
  }
}

// Run the function
seedUsers();
