const express = require('express')
const router = express.Router()

// 首頁
router.get('/', (req, res, next)=>{
  return res.render('index2')
})

// 新增頁面
router.get('/new', (req, res, next)=>{
  
})

// 編輯頁面
router.get('/edit/:id', (req, res, next)=>{
  
})

// 新增
router.post('/', (req, res, next)=>{
  
})

// 編輯
router.put('/', (req, res, next)=>{
  
})

// 刪除
router.delete('/', (req, res, next)=>{
  
})

module.exports = router