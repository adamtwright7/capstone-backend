'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourcesRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResourcesRooms.init({
    id: DataTypes.INTEGER,
    resourceID: DataTypes.INTEGER,
    roomID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResourcesRooms',
  });
  return ResourcesRooms;
};