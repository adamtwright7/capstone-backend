"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ScenesRooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sceneID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Scenes",
          key: "id",
          as: "sceneID",
        },
      },
      roomID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Rooms",
          key: "id",
          as: "roomID",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ScenesRooms");
  },
};
