const express = require('express')
const { READUNCOMMITTED } = require('sequelize/lib/table-hints')
const router = express.Router()

const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')
const errorHandler = require('../middlewares/error-handler')

router.get('/', (req, res, next)=>{
  return res.render('register')
})

router.post('/', (req, res, next)=>{
  const {name, email, password, confirmPassword} = req.body
  if(!email || !password) {
    req.flash('error', 'email 和密碼為必填')
  }
  if(password !== confirmPassword) {
    req.flash('error', '再次輸入的密碼不正確')
    return res.redirect('back')
  }
  return User.count({where:{email}})
    .then((amount)=>{
      if(amount>0) {
        req.flash('error', 'email被註冊過')
        return res.redirect('back')
      }
      return bcrypt.hash(password, 10)
        .then((hash)=>{
          return User.create({name, email, password:hash})
        })
    })
    .then((user)=>{
      if(!user) {
        req.flash('error', '註冊失敗')
        return res.redirect('back')
      }
      req.flash('success', '註冊成功')
      return res.redirect('/login')
    })
    .catch((error)=>{
      console.log(error.message)
      next(error)
    })
})

module.exports = router