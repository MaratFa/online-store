const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Please add a category name',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.JSON,
    defaultValue: {
      public_id: '',
      url: '',
    },
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
});

module.exports = Category;