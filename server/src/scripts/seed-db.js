const { User, Product, Category, Order, Cart } = require('../models');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');

    // Clear existing data
    await User.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Cart.destroy({ where: {} });

    console.log('Database cleared');

    // Create categories
    const categories = await Category.bulkCreate([
      {
        id: uuidv4(),
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        image: { public_id: '', url: '' }
      },
      {
        id: uuidv4(),
        name: 'Clothing',
        description: 'Clothing and apparel',
        image: { public_id: '', url: '' }
      },
      {
        id: uuidv4(),
        name: 'Home',
        description: 'Home and garden items',
        image: { public_id: '', url: '' }
      }
    ]);

    console.log('Categories created successfully');

    // Create users
    const users = await User.bulkCreate([
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // Will be hashed by the model's beforeCreate hook
        role: 'admin'
      },
      {
        id: uuidv4(),
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123', // Will be hashed by the model's beforeCreate hook
        role: 'user'
      }
    ]);

    console.log('Admin user created: admin@example.com');
    console.log('Regular user created: user@example.com');

    // Create products
    const electronicsCategory = categories.find(c => c.name === 'Electronics');
    const clothingCategory = categories.find(c => c.name === 'Clothing');
    const homeCategory = categories.find(c => c.name === 'Home');

    await Product.bulkCreate([
      {
        id: uuidv4(),
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        categoryId: electronicsCategory.id,
        images: [{ public_id: 'smartphone_1', url: 'https://example.com/images/smartphone1.jpg' }],
        stock: 50
      },
      {
        id: uuidv4(),
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        categoryId: electronicsCategory.id,
        images: [{ public_id: 'laptop_1', url: 'https://example.com/images/laptop1.jpg' }],
        stock: 30
      },
      {
        id: uuidv4(),
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        categoryId: clothingCategory.id,
        images: [{ public_id: 'tshirt_1', url: 'https://example.com/images/tshirt1.jpg' }],
        stock: 100
      },
      {
        id: uuidv4(),
        name: 'Jeans',
        description: 'Classic denim jeans',
        price: 49.99,
        categoryId: clothingCategory.id,
        images: [{ public_id: 'jeans_1', url: 'https://example.com/images/jeans1.jpg' }],
        stock: 75
      },
      {
        id: uuidv4(),
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 79.99,
        categoryId: homeCategory.id,
        images: [{ public_id: 'coffee_maker_1', url: 'https://example.com/images/coffee1.jpg' }],
        stock: 25
      },
      {
        id: uuidv4(),
        name: 'Garden Tools Set',
        description: 'Complete set of essential garden tools',
        price: 39.99,
        categoryId: homeCategory.id,
        images: [{ public_id: 'garden_tools_1', url: 'https://example.com/images/garden1.jpg' }],
        stock: 40
      }
    ]);

    console.log('Products created successfully');
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeding function
seedDatabase();
