const express = require('express')
const router = express.Router()
const expense = require('./expense')


router.use('/expenses', expense)

router.get('/', (req, res, next)=>{
  return res.redirect('/expenses')
})

module.exports = router