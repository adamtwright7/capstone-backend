"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Resources", [
      {
        name: "Femme Elf",
        image:
          "https://i.pinimg.com/564x/5d/77/30/5d7730cd1f92eb90a7701fd34be2da1a.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Goblin",
        image:
          "https://i.pinimg.com/564x/50/78/38/507838fe552e176b67e0be6f876e4c47.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dwarf",
        image:
          "https://i.pinimg.com/564x/7d/e4/34/7de4343875e264d593f26f1ca5adda29.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Drow Masc Warrior",
        image:
          "https://i.pinimg.com/564x/7f/db/ff/7fdbffb92657c6e908857615e8cb793e.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Masc Human Warrior",
        image:
          "https://i.pinimg.com/564x/99/d7/b8/99d7b8f7d492f2b65b701e310689f52f.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Masc Bard",
        image:
          "https://i.pinimg.com/564x/8b/94/d8/8b94d8d6cdc91774465f738e57d4b128.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dimetrodon",
        image:
          "https://i.pinimg.com/564x/47/07/4e/47074e4f4f647ef0f4c2f7318ac17e93.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dragon",
        image:
          "https://i.pinimg.com/564x/65/74/bc/6574bc9675f1fad73f017c9e38167dc0.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Resources", null, {});
  },
};
