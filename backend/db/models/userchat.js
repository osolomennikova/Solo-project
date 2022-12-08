'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChat extends Model {
    static associate(models) {
     this.belongsTo(models.User, {foreignKey: 'user_id'});
     this.belongsTo(models.Room, {foreignKey: 'room_id'});
    }
  }
  UserChat.init({
    chat_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserChat',
  });
  return UserChat;
};
