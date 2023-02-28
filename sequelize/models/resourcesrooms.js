"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResourcesRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ResourcesRooms.belongsTo(models.Resources, {
        foreignKey: "resourceID",
      });
      ResourcesRooms.belongsTo(models.Rooms, {
        foreignKey: "roomID",
      });
    }
  }
  ResourcesRooms.init(
    {
      resourceID: DataTypes.INTEGER,
      roomID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ResourcesRooms",
    }
  );
  return ResourcesRooms;
};
