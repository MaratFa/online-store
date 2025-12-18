// Load environment variables
require('dotenv').config({ path: '../../.env' });

const { sequelize: database, User, Category, Product } = require('../models');
const bcrypt = require('bcryptjs');

// Seed data
const seedData = async () => {
  try {
    // Sync all models
    await database.sync({ force: true });
    console.log('Database synced!');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });

    console.log('Admin user created!');

    // Create regular user
    const userSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash('user123', userSalt);

    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userHashedPassword,
      role: 'user',
      firstName: 'Regular',
      lastName: 'User'
    });

    console.log('Regular user created!');

    // Create categories
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel'
      },
      {
        name: 'Home & Garden',
        description: 'Items for your home and garden'
      },
      {
        name: 'Sports',
        description: 'Sports equipment and accessories'
      }
    ]);

    console.log('Categories created!');

    // Create products
    const products = await Product.bulkCreate([
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        sku: 'ELEC-001',
        stock: 50,
        featured: true,
        categoryId: categories[0].id,
        images: ['https://example.com/phone1.jpg', 'https://example.com/phone2.jpg']
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        sku: 'ELEC-002',
        stock: 30,
        featured: true,
        categoryId: categories[0].id,
        images: ['https://example.com/laptop1.jpg', 'https://example.com/laptop2.jpg']
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        sku: 'CLO-001',
        stock: 100,
        featured: false,
        categoryId: categories[1].id,
        images: ['https://example.com/tshirt1.jpg']
      },
      {
        name: 'Jeans',
        description: 'Classic denim jeans',
        price: 49.99,
        sku: 'CLO-002',
        stock: 80,
        featured: false,
        categoryId: categories[1].id,
        images: ['https://example.com/jeans1.jpg']
      },
      {
        name: 'Garden Set',
        description: 'Complete garden furniture set',
        price: 399.99,
        sku: 'HG-001',
        stock: 20,
        featured: true,
        categoryId: categories[2].id,
        images: ['https://example.com/garden1.jpg', 'https://example.com/garden2.jpg']
      },
      {
        name: 'Tennis Racket',
        description: 'Professional tennis racket',
        price: 129.99,
        sku: 'SPT-001',
        stock: 40,
        featured: false,
        categoryId: categories[3].id,
        images: ['https://example.com/racket1.jpg']
      }
    ]);

    console.log('Products created!');
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await database.close();
  }
};

// Run the seed function
seedData();
