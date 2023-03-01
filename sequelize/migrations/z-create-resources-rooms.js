// "z" prefaces the file names of the join tables so that they're migrated last (and have all their dependencies).

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ResourcesRooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      resourceID: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Resources",
          key: "id",
          as: "resourceID",
        },
      },
      roomID: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("ResourcesRooms");
  },
};
