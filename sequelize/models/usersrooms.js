"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsersRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  UsersRooms.init(
    {
      userID: DataTypes.INTEGER,
      roomID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UsersRooms",
    }
  );
  return UsersRooms;
};
