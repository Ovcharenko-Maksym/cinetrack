const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const CustomMovie = sequelize.define(
  'CustomMovie',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director: DataTypes.STRING,
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    poster_url: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'custom_movies',
    timestamps: false,
  }
);

module.exports = CustomMovie;
