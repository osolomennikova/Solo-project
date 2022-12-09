'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
     this.belongsTo(models.Room, {foreignKey: 'room_id'})
      this.belongsTo(models.User, {foreignKey: 'user_id'})
    }
  }
  History.init({
    room_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};
