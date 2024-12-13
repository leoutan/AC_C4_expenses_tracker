'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull:false
    })
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'email')
    await queryInterface.removeColumn('users', 'password')
  }
};
