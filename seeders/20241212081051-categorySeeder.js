'use strict';


const CATEGORY = {
  Housing: 'fa-solid fa-house',
  Transportation: 'fa-solid fa-van-shuttle',
  Entertainment: 'fa-solid fa-face-grin-beam',
  Food: 'fa-solid fa-utensils',
  Other: 'fa-solid fa-pen',
  Income: 'fa-solid fa-money-bill-1-wave',
};


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // Object.keys(CATEGORY).map
    const categories = []
    for (let category in CATEGORY) {
      categories.push({name:category, icon:CATEGORY[category]})
    }
    await queryInterface.bulkInsert('categories', categories)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('categories', null)
  }
};
