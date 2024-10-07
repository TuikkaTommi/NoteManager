const sequelize = require('../dbConn');
const { DataTypes } = require('sequelize');

// Model for an user
const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isadmin: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = User;
