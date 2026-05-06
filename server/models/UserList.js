const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const UserList = sequelize.define(
  'UserList',
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
    imdb_id: DataTypes.STRING,
    custom_movie_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('watchlist', 'watched', 'favorites'),
      allowNull: false,
    },
    user_rating: DataTypes.DECIMAL(3, 1),
    review: DataTypes.STRING(500),
    watched_at: DataTypes.DATE,
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
    tableName: 'user_lists',
    timestamps: false,
  }
);

module.exports = UserList;
