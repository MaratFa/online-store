const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_DB || "online_store",
  process.env.PG_USER || "postgres",
  process.env.PG_PASSWORD || "7o3o18",
  {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;