const express = require('express')
const router = express.Router()
const expense = require('./expense')
const register = require('./register')
const login_logout = require('./login_logout')

const authHandler = require('../middlewares/auth-handler')

router.use('/expenses', authHandler, expense)
router.use('/register', register)
router.use('/', login_logout)

router.get('/', (req, res, next)=>{
  return res.redirect('/expenses')
})

module.exports = router