// 參考程式碼
// https://github.com/alan890729/expense-tracker/tree/a9358de98b696119546a9fe9fe528eb1e57bbc97
// https://github.com/kim1037/AC-expense-tracker/tree/main

const express = require('express')
const router = express.Router()

const db = require('../models')
const { Model, where } = require('sequelize')
const { raw } = require('mysql2')
const record = require('../models/record')
const Record = db.Record
const Category = db.Category

// 首頁
router.get('/', async (req, res, next)=>{
  const userId = req.session.user!==undefined?req.session.user.id:req.user.id
  const categoryName = req.query.category || null
  // if(categoryName) {
  //   return Category.findOne({
  //     attributes:['id'],
  //     where:{name:categoryName},
  //     raw:true
  //   })
  //     .then((category)=>{
  //       const categoryId = category.id
  //       return findRecords(userId, categoryId)
  //     })
  //     .then((data)=>{
  //       let [categories, records, totalAmount] = data
  //       if (!totalAmount) {
  //         totalAmount = 0
  //       }

  //       categories.forEach((category)=>{
  //         if(category.name === categoryName) {
  //           category.isSelected = true
  //         }
  //       })

  //       records.forEach((record)=>{
  //         record.categoryIcon = record['Category.icon'] 
  //       })
  //       return res.render('index', {categories, records, totalAmount})
  //     })
  // } else {
  //   return findRecords(userId, null)
  //     .then((data)=>{
  //       let [categories, records, totalAmount] = data
  //       if (!totalAmount) {
  //         totalAmount = 0
  //       }
  //       categories.forEach((category)=>{
  //         if(category.name === categoryName) {
  //           category.isSelected = true
  //         }
  //       })

  //       records.forEach((record)=>{
  //         record.categoryIcon = record['Category.icon'] 
  //       })
  //       return res.render('index', {categories, records, totalAmount})
  //     })
  // }
  function findRecords(userId, categoryId){
    return Promise.all([
      Category.findAll({
        attributes:['id', 'name'],
        raw:true
      }),
      Record.findAll({
        where:categoryId?{userId, categoryId}:{userId},
        include:[{
          model: Category,
          as:'Category',
          attributes:['icon']
        }],
        raw:true
      }),
      Record.sum('amount', {
        where:categoryId?{userId, categoryId}:{userId}
      })
    ])
  }
// =================== 以下為 await 寫法 ==================
// 排序方式
const sortOption = req.query.sort  
let sortCondition = []
switch (sortOption) {
  case 'ASC':
  case 'DESC':
    sortCondition = [['name', sortOption]]
    break
  case 'amount_ASC':
    sortCondition = [['amount', 'ASC']]
    break
  case 'amount_DESC':
    sortCondition = [['amount', 'DESC']]
    break
  case 'date_ASC':
    sortCondition = [['createdAt', 'ASC']]
    break
  case 'date_DESC':
    sortCondition = [['createdAt', 'DESC']]
    break
}
  const limit = 5
  const currentPage = +req.query.page || 1  //加上 + 號確保資料為數字而非字串
  let categoryId
  let category
  if(categoryName) {  //有選擇類別時
    category = await Category.findOne({
      attributes:['id'],
      where:{name:categoryName},
      raw:true
    })
    categoryId = category.id
  } else {   //沒有選擇類別時
    categoryId = null
  }
  console.log(categoryId)
  
  // 查詢類別為了渲染下拉選單
  const categories = await Category.findAll({
    attributes:['id', 'name'],
    raw:true
  })
  // 加上 isSelected 屬性，在下拉選單顯示哪個類別被選中
  for (let category of categories) {
    if(categoryName && (category.name === categoryName)) {
      category.isSelected = true
    }
  }

  // 查詢紀錄同時關聯到類別
  const {count, rows:records} = await Record.findAndCountAll({
    where:categoryId?{userId, categoryId}:{userId},
    include:[{
      model: Category,
      as:'Category',
      attributes:['icon']
    }],
    offset: (currentPage-1)*limit,
    limit,
    order: sortCondition,
    raw:true
  })

  // 將查詢到的類別結果，放到另一個適當的屬性
  // 因為樣板沒辦法處理 'Category.icon'
  for (let record of records) {
    record.categoryIcon = record['Category.icon']
  }

  // 處理頁數
  const totalPage = Math.ceil(count/limit)
  const prevPage = currentPage>1?currentPage-1:currentPage
  const nextPage = currentPage<totalPage?currentPage+1:currentPage
  console.log(prevPage)
  console.log(nextPage)

  // 查詢所有筆數總和
  const totalAmount = await Record.sum('amount', {
    where:categoryId?{userId, categoryId}:{userId}
  })
  return res.render('index', {categories, categoryName, records, totalAmount, currentPage,
    prevPage, nextPage, totalPage, sort:sortOption
  })



  
  // if(categoryName) {
  //   category = await Category.findOne({
  //     attributes:['id'],
  //     where:{name:categoryName},
  //     raw:true
  //   })
  // }
  // categoryId = category.id
  // console.log(categoryId) 
  // const categories = await Category.findAll({
  //   attributes:['id', 'name'],
  //   raw:true
  // })
  // console.log('categoryName:', categoryName)
  // categories.forEach((category)=>{
  //   if(category.name === categoryName) {
  //     category.isSelected = true
  //   }
  // })
  // console.log('categories: ', categories)
  // const records = await Record.findAll({
  //   where:{userId},
  //   include:[{
  //     model: Category,
  //     as:'Category',
  //     attributes:['icon']
  //   }],
  //   raw:true
  // })
  // const addIconRecords = records.map((record)=>{
  //   return {
  //     ...record, //將物件展開
  //     categoryIcon: record['Category.icon'] //將值放入合適的屬性
  //   }
  // })
  // return res.render('index', {records: addIconRecords, categories})
  // return Record.findAll({
  //   where:{userId},
  //   include:[{
  //     model: Category,
  //     as:'Category',
  //     attributes:['icon']
  //   }],
  //   raw:true
  // })
  //   .then((records)=>{
  //     const addIconRecords = records.map((record)=>{
  //       return {
  //         ...record, //將物件展開
  //         categoryIcon: record['Category.icon'] //將值放入合適的屬性
  //       }
  //     })
  //     return res.render('index', {records: addIconRecords})
  //   })
  //   .catch((error)=>{
  //     error.errorMessage = '資料載入失敗'
  //     return res.redirect('/login')
  //   })
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
  const userId = req.session.user!==undefined?req.session.user.id:req.user.id
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
  const userId = req.session.user!==undefined?req.session.user.id:req.user.id
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
  const userId = req.session.user!==undefined?req.session.user.id:req.user.id
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
  const userId = req.session.user!==undefined?req.session.user.id:req.user.id
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