// User Model — Sequelize definition
// TODO: Implement in Lab 4

// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/config');

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     validate: { len: [2, 100] },
//   },
//   email: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     unique: true,
//     validate: { isEmail: true },
//   },
//   password: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
// }, {
//   tableName: 'users',
//   timestamps: true,
// });

// module.exports = User;
