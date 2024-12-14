const express = require('express')
const {engine} = require('express-handlebars')
const app = express()
const port = 3000
const router = require('./routes')

const methodOverride = require('method-override')

const handlebars = require('handlebars')

// if(process.env.NODE_ENV === 'development') {
//   require('dotenv').config()
// }
// const session = require('express-session')
// const flash = require('connect-flash')

app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

handlebars.registerHelper('eq', (arg1, arg2)=>{
  return arg1 === arg2
})

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))

// app.use(express.static('public'))
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
// app.use(flash())

app.use(router)

app.listen(port, ()=>{
  console.log(`expense-tracker Server on http://localhost:${port}`)
})