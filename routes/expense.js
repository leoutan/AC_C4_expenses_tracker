const express = require('express')
const router = express.Router()

const db = require('../models')
const { Model, where } = require('sequelize')
const { raw } = require('mysql2')
const Record = db.Record
const Category = db.Category

// 首頁
router.get('/', (req, res, next)=>{
  return Record.findAll({
    include:{
      model: Category,
      as:'Category',
      attributes:['icon']
    },
    raw:true
  })
    .then((records)=>{
      const addIconRecords = records.map((record)=>{
        return {
          ...record, //將物件展開
          categoryIcon: record['Category.icon'] //將值放入合適的屬性
        }
      })
      return res.render('index2', {records: addIconRecords})
    })
})

// 新增頁面
router.get('/new', (req, res, next)=>{
  return Category.findAll({
    raw:true
  })
    .then((categories)=>{
      return res.render('new', {categories})
    })
})

// 編輯頁面
router.get('/edit/:id', (req, res, next)=>{
  const id = req.params.id
  return Promise.all([
    Category.findAll({
      attributes:['id', 'name'],
      raw:true
    }),
    Record.findOne({
      where:{id},
      include:{
        model:Category,
        as:'Category'
      },
      raw:true
    })])
    .then((data)=>{
      const [categories, record] = data
      // for(let category of categories) {
      //   if(category.name === record['Category.name']) {
      //     category.selected = true
      //   }
      // }
      categories.forEach((category)=>{
        if(category.name === record['Category.name']) {
          category.selected = true
        }
      })
      console.log(categories)
      return res.render('edit', {record, categories})
    })
})

// 新增
router.post('/', (req, res, next)=>{
  const body = req.body
  return Record.create(body)
    .then(()=>{
      req.flash('success', '新增成功')
      return res.redirect('/expenses')
    })
    .catch((error)=>{
      error.errorMessage = '新增失敗'
      next(error)
    })
})

// 編輯
router.put('/:id', (req, res, next)=>{
  const id = req.params.id
  return Record.update({
    where:{id}
  })
  .then(()=>{

  })
})

// 刪除
router.delete('/:id', (req, res, next)=>{
  return res.send('刪除')
})

module.exports = router