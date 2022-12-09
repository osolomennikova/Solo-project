'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      this.hasMany(models.UserChat, {foreignKey: 'room_id'});
      this.hasMany(models.History, {foreignKey: 'room_id'});
    }
  }
  Room.init({
    room_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
