// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Create a new PostgreSQL client
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

async function createUser(): Promise<void> {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Insert the admin user
    const insertQuery = `
      INSERT INTO "Users" (username, email, password, role, "firstName", "lastName", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id;
    `;

    const values = ['admin', 'admin@example.com', hashedPassword, 'admin', 'Admin', 'User'];
    const result = await pool.query(insertQuery, values);

    console.log('Admin user created with ID:', result.rows[0].id);

    // Insert a regular user
    const userSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash('user123', userSalt);

    const userInsertQuery = `
      INSERT INTO "Users" (username, email, password, role, "firstName", "lastName", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id;
    `;

    const userValues = ['user', 'user@example.com', userHashedPassword, 'user', 'Regular', 'User'];
    const userResult = await pool.query(userInsertQuery, userValues);

    console.log('Regular user created with ID:', userResult.rows[0].id);

    console.log('Users created successfully!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    // Close the connection
    await pool.end();
  }
}

// Run the function
createUser();
