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

async function createTables(): Promise<void> {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'user',
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        "zipCode" VARCHAR(20),
        country VARCHAR(100),
        "resetPasswordToken" VARCHAR(255),
        "resetPasswordExpire" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Users table created or already exists');

    // Create Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Categories" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Categories table created or already exists');

    // Create Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Products" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        sku VARCHAR(100) UNIQUE,
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        "categoryId" INTEGER REFERENCES "Categories"(id),
        images TEXT[],
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Products table created or already exists');

    // Create Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Orders" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "Users"(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        "shippingAddress" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Orders table created or already exists');

    // Create Cart table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Carts" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "Users"(id),
        "productId" INTEGER REFERENCES "Products"(id),
        quantity INTEGER DEFAULT 1,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Carts table created or already exists');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

async function createUser(): Promise<void> {
  try {
    // First create tables if they don't exist
    await createTables();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Check if admin user already exists
    const adminCheck = await pool.query('SELECT * FROM "Users" WHERE email = $1', ['admin@example.com']);

    if (adminCheck.rows.length === 0) {
      // Insert the admin user
      const insertQuery = `
        INSERT INTO "Users" (username, email, password, role, "firstName", "lastName", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id;
      `;

      const values = ['admin', 'admin@example.com', hashedPassword, 'admin', 'Admin', 'User'];
      const result = await pool.query(insertQuery, values);

      console.log('Admin user created with ID:', result.rows[0].id);
    } else {
      console.log('Admin user already exists');
    }

    // Check if regular user already exists
    const userCheck = await pool.query('SELECT * FROM "Users" WHERE email = $1', ['user@example.com']);

    if (userCheck.rows.length === 0) {
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
    } else {
      console.log('Regular user already exists');
    }

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
