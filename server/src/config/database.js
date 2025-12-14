const { Sequelize } = require('sequelize');

// Check if DATABASE_URL is available (for Vercel)
if (process.env.DATABASE_URL) {
  // Use DATABASE_URL for production (Vercel)
  var sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Use individual environment variables for development
  var sequelize = new Sequelize(
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
}

module.exports = sequelize;