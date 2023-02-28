"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Scenes", [
      {
        name: "War Room Interior",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2F71cac47b944ae4144dbc6b11950d443a.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Elven Magitech Portal",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2F9289c5a486905980f5912b44061ecbfd.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Forgotten Chapel Graveyard",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2Fbdaaf3382983a429f83a6916d7733515.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Badger Hill Underground",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2F029d74b087fb890a5740c5683916a66b.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Impact Site",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2F471248de5af4922f3b1d05d6d45fdab1.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fey Village",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2Ffdd232082e15d5c0db9cc28d8393802d.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Abandoned Mine Entrance",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2F62f2c6b12af53c5d68e6dfe181fa3b62.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Antlion Canyon",
        image:
          "https://www.czepeku.com/_next/image?url=https%3A%2F%2Fdan-sst-imageresize-mystack-bucketd7feb781-1513bmdx4x8mh.s3.amazonaws.com%2Fmap%2Fpreview%2Fda3f5efd89303b6b67325ea85451cb04.webp&w=1920&q=75",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scenes", null, {});
  },
};
