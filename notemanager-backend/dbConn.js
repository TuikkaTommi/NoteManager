const { Sequelize } = require('sequelize');

// Connect to MySQL-database, config from .env
const sequelize = new Sequelize(
  process.env.DB_SELECTED_DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

module.exports = sequelize;
