"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsersRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsersRooms.belongsTo(models.Users, {
        // This establishes a foreign key in UsersRooms that refers to Users.
        foreignKey: "userID",
      });
      UsersRooms.belongsTo(models.Rooms, {
        // This establishes a foreign key in UsersRooms that refers to Users.
        foreignKey: "roomID",
      });
    }
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
