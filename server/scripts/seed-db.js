require('dotenv').config();
const { sequelize, User, Category, Product } = require('../src/models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created:', adminUser.email);
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', salt);
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });
    
    console.log('Regular user created:', regularUser.email);
    
    // Create categories
    const electronicsCategory = await Category.create({
      name: 'Electronics',
      description: 'Electronic devices and accessories'
    });
    
    const clothingCategory = await Category.create({
      name: 'Clothing',
      description: 'Apparel and fashion items'
    });
    
    const homeCategory = await Category.create({
      name: 'Home & Garden',
      description: 'Items for home and garden'
    });
    
    console.log('Categories created successfully');
    
    // Create products
    await Product.bulkCreate([
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        categoryId: electronicsCategory.id,
        stock: 50,
        images: [
          {
            public_id: 'smartphone_1',
            url: 'https://example.com/images/smartphone1.jpg'
          }
        ]
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        categoryId: electronicsCategory.id,
        stock: 30,
        images: [
          {
            public_id: 'laptop_1',
            url: 'https://example.com/images/laptop1.jpg'
          }
        ]
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        categoryId: clothingCategory.id,
        stock: 100,
        images: [
          {
            public_id: 'tshirt_1',
            url: 'https://example.com/images/tshirt1.jpg'
          }
        ]
      },
      {
        name: 'Jeans',
        description: 'Classic denim jeans',
        price: 49.99,
        categoryId: clothingCategory.id,
        stock: 75,
        images: [
          {
            public_id: 'jeans_1',
            url: 'https://example.com/images/jeans1.jpg'
          }
        ]
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 79.99,
        categoryId: homeCategory.id,
        stock: 25,
        images: [
          {
            public_id: 'coffee_maker_1',
            url: 'https://example.com/images/coffee1.jpg'
          }
        ]
      },
      {
        name: 'Garden Tools Set',
        description: 'Complete set of essential garden tools',
        price: 39.99,
        categoryId: homeCategory.id,
        stock: 40,
        images: [
          {
            public_id: 'garden_tools_1',
            url: 'https://example.com/images/garden1.jpg'
          }
        ]
      }
    ]);
    
    console.log('Products created successfully');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();