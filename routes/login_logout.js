const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')

router.get('/login', (req, res, next)=>{
  return res.render('login', {hideLogout: true})
})

router.post('/login', (req, res, next)=>{
  const {email, password} = req.body
  return User.findOne({where:{email}})
    .then((user)=>{
      if(!user) {
        req.flash('error', 'email不存在')
        return res.redirect('back')
      }
      return bcrypt.compare(password, user.password)
        .then((isMatch)=>{
          if(isMatch) {
            req.session.user = {
              id:user.id,
              email:user.email,
              password:user.password
            }
            console.log('req.session: ', req.session)
            return res.redirect('/expenses')
          }
          req.flash('error', '密碼錯誤')
          return res.redirect('back')
        })
    })
    .catch((error)=>{
      error.errorMessage='登入失敗'
      next(error)
    })
})

router.post('/logout', (req, res, next)=>{
  req.session.destroy((error)=>{
    if(error) {
      req.flash('error', '登出失敗，請再試一次')
      return res.redirect('back')
    }
    // console.log('req.session: ', req.session)
    res.locals.success = '登出成功'
    return res.redirect('/login')
  })
})

module.exports = router