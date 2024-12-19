const express = require('express')
const router = express.Router()

const db = require('../models')
const { Model, where } = require('sequelize')
const { raw } = require('mysql2')
const Record = db.Record
const Category = db.Category

// 首頁
router.get('/', (req, res, next)=>{
  const userId = req.session.user.id
  return Record.findAll({
    where:{userId},
    include:[{
      model: Category,
      as:'Category',
      attributes:['icon']
    }],
    raw:true
  })
    .then((records)=>{
      const addIconRecords = records.map((record)=>{
        return {
          ...record, //將物件展開
          categoryIcon: record['Category.icon'] //將值放入合適的屬性
        }
      })
      return res.render('index', {records: addIconRecords})
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
  const userId = req.session.user.id
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
      console.log(data)
      const [categories, record] = data
      
      // 將扁平化後的資料在路由先處理，因為 'Category.name' 在 hbs 無法處理
      categories.forEach((category)=>{
        if(category.name === record['Category.name']) {
          category.selected = true
        }
      })

      // 判斷資料
      if(!record) {
        req.flash('error', '資料不存在')
        return res.redirect('back')
      }

      // 判斷權限 
      if(record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('back')
      }
      return res.render('edit', {record, categories})
    })
    .catch((error)=>{
      error.errorMessage ='載入失敗'
      next(error)
    })
})

// 新增
router.post('/', (req, res, next)=>{
  const body = req.body
  const userId = req.session.user.id
  return Record.create({...body, userId})
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
  const body = req.body
  const userId = req.session.user.id
  return Record.findOne({
    where:{id}
  })
    .then((record)=>{
      if(!record) {
        req.flash('error', '資料不存在')
        return res.redirect('back')
      }
      if(record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/expenses')
      }
      return record.update(body)
        .then(()=>{
          req.flash('success', '更新成功')
          return res.redirect('/expenses')
        })
    })
    .catch((error)=>{
      error.errorMessage = '更新失敗'
      next(error)
    })
})

// 刪除
router.delete('/:id', (req, res, next)=>{
  const id = req.params.id
  const userId = req.session.user.id
  return Record.findOne({
    where:{id}
  })
    .then((record)=>{
      if(!record) {
        req.flash('error', '資料不存在')
        return res.redirect('back')
      }
      if(record.userId !== userId) {
        req.flash('error', '權限不足')
        return res.redirect('/expenses')
      }
      return record.destroy()
        .then(()=>{
          req.flash('success', '刪除成功')
          return res.redirect('/expenses')
        })
    })
    .catch((error)=>{
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router