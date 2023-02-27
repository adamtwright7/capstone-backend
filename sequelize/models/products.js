"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.hasMany(models.Orders, {
        foreignKey: "productId",
      });
    }
  }
  Products.init(
    {
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      desc: DataTypes.TEXT,
      rarity: DataTypes.STRING,
      requires_attunement: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Products",
      timestamps: false,
    }
  );
  return Products;
};
