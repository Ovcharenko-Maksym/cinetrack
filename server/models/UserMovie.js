// UserMovie Model — Junction table for user-movie relationships
// TODO: Implement in Lab 4

// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/config');

// const UserMovie = sequelize.define('UserMovie', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: { model: 'users', key: 'id' },
//   },
//   movieId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: { model: 'movies', key: 'id' },
//   },
//   status: {
//     type: DataTypes.ENUM('watchlist', 'watched', 'favorites'),
//     allowNull: false,
//     defaultValue: 'watchlist',
//   },
//   userRating: {
//     type: DataTypes.INTEGER,
//     validate: { min: 1, max: 10 },
//   },
//   review: {
//     type: DataTypes.TEXT,
//     validate: { len: [0, 500] },
//   },
//   watchedAt: {
//     type: DataTypes.DATEONLY,
//   },
// }, {
//   tableName: 'user_movies',
//   timestamps: true,
// });

// module.exports = UserMovie;
