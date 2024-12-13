'use strict';
const bcrypt = require('bcryptjs')
const rawRecord = require('../public/jsons/record.json')

const db = require('../models');
const record = require('../models/record');
const Category = db.Category
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()
      // 插入種子用戶user1
      const SEED_USER = await Promise.all(Array.from({length:1}, async (_, i)=>{
        const hash = await bcrypt.hash('12345678', 10)
        return {
          id: i+1,
          name: `user${i+1}`,
          email: `user${i+1}@example.com`,
          password:hash
        }
      }))
      // console.log('SEED_USER: ', SEED_USER)
      await queryInterface.bulkInsert('users', SEED_USER, {transaction})

      // 取出支出項目
      const expenseRecord = rawRecord.filter((record)=>{
        return record.type === 'expense'
      })
      
      // 遍歷每個項目，加上 userId categoryId
      const initialRecord = await Promise.all(
        expenseRecord.map(async (record, index)=>{
          const category = await Category.findOne({where:{name:record.category}})
          const {name,  date, amount} =  record
          return {
            name,
            date,
            amount,
            userId:SEED_USER[index%SEED_USER.length].id,
            categoryId:category.id
          }
        })
      )

      console.log('initialRecord: ', initialRecord)
      await queryInterface.bulkInsert('records', 
        initialRecord, {transaction}
      )
      await transaction.commit()
      console.log('good')
    } catch (error) {
      console.log(error)
      if(transaction) await transaction.rollback()
    }
    

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
