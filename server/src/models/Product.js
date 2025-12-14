const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a product name',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please add a description',
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0',
      },
    },
  },
  discountedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: {
        args: [0],
        msg: 'Discounted price must be greater than or equal to 0',
      },
    },
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock must be greater than or equal to 0',
      },
    },
  },
  sold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ratings: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Rating must be between 0 and 5',
      },
      max: {
        args: [5],
        msg: 'Rating must be between 0 and 5',
      },
    },
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Product;