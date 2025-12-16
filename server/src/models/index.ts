import { sequelize } from '../config/db';
import User from './User';
import Category from './Category';
import Product from './Product';
import Cart from './Cart';
import Order from './Order';

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

export const syncDb = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

export {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  Order
};
