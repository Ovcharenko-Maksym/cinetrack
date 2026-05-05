// Movie Model — Sequelize definition
// TODO: Implement in Lab 4

// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/config');

// const Movie = sequelize.define('Movie', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   imdbId: {
//     type: DataTypes.STRING(20),
//     allowNull: false,
//     unique: true,
//   },
//   title: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   year: {
//     type: DataTypes.STRING(10),
//   },
//   genre: {
//     type: DataTypes.STRING(255),
//   },
//   director: {
//     type: DataTypes.STRING(255),
//   },
//   poster: {
//     type: DataTypes.TEXT,
//   },
//   imdbRating: {
//     type: DataTypes.STRING(10),
//   },
//   runtime: {
//     type: DataTypes.STRING(20),
//   },
//   plot: {
//     type: DataTypes.TEXT,
//   },
// }, {
//   tableName: 'movies',
//   timestamps: true,
// });

// module.exports = Movie;
