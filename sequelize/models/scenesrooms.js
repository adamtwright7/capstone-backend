"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScenesRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ScenesRooms.belongsTo(models.Scenes, {
        foreignKey: "sceneID",
      });
      ScenesRooms.belongsTo(models.Rooms, {
        foreignKey: "roomID",
      });
    }
  }
  ScenesRooms.init(
    {
      sceneID: DataTypes.INTEGER,
      roomID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ScenesRooms",
    }
  );
  return ScenesRooms;
};
