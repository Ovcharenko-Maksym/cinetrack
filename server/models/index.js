const { sequelize, testConnection } = require('../db/config');
const User = require('./User');
const CustomMovie = require('./CustomMovie');
const UserList = require('./UserList');
const ActivityLog = require('./ActivityLog');

User.hasMany(CustomMovie, { foreignKey: 'user_id' });
CustomMovie.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserList, { foreignKey: 'user_id' });
UserList.belongsTo(User, { foreignKey: 'user_id' });

CustomMovie.hasMany(UserList, { foreignKey: 'custom_movie_id' });
UserList.belongsTo(CustomMovie, { foreignKey: 'custom_movie_id' });

User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  testConnection,
  User,
  CustomMovie,
  UserList,
  ActivityLog,
};
