"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    // since there are 5 pages of data, we have to do 5 API calls

    const firstPageData = await fetch(
      "https://api.open5e.com/magicitems?page=1"
    );
    const firstPageJson = await firstPageData.json();

    const secondPageData = await fetch(
      "https://api.open5e.com/magicitems?page=2"
    );
    const secondPageJson = await secondPageData.json();

    const thirdPageData = await fetch(
      "https://api.open5e.com/magicitems?page=3"
    );
    const thirdPageJson = await thirdPageData.json();

    const fourthPageData = await fetch(
      "https://api.open5e.com/magicitems?page=4"
    );
    const fourthPageJson = await fourthPageData.json();

    const fifthPageData = await fetch(
      "https://api.open5e.com/magicitems?page=5"
    );
    const fifthPageJson = await fifthPageData.json();

    const allData = firstPageJson.results.concat(
      secondPageJson.results,
      thirdPageJson.results,
      fourthPageJson.results,
      fifthPageJson.results
    );

    const cleanData = allData.map((item) => {
      delete item.document__slug;
      delete item.document__title;
      return item;
    });

    await queryInterface.bulkInsert("Products", cleanData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
