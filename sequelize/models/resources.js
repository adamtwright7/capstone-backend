"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // We associate resources with rooms rather than users so that any user in a room can add resources
      Resources.hasOne(models.ResourcesRooms, {
        foreignKey: "resourceID",
      });
    }
  }
  Resources.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Resources",
    }
  );
  return Resources;
};
