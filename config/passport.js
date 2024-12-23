const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')
const { raw } = require('mysql2')

passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done)=>{
  return User.findOne({
    where:{email},
    raw:true
  })
    .then((user)=>{
      if(!user) {
        return done(null, false, {type:'error', message:'email不存在'})
      }
      return bcrypt.compare(password, user.password)
        .then((isMatch)=>{
          if(isMatch) {
            return done(null, user, {type:'success', message:'登入成功'})
          }
          return done(null, false, {type:'error', message:'密碼錯誤'})
        })
    })
    .catch((error)=>{
      return done(error)
    })
}))

passport.use(new FacebookStrategy({
  clientID:process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL:process.env.FACEBOOK_CALLBACK_URL,
  profileFields:['email', 'displayName']
}, (accessToken, refreshToken, profile, done)=>{
  console.log('accessToken: ', accessToken)
  console.log('profile: ', profile)

  const email = profile.emails[0].value
  const name = profile.displayName

  return User.findOne({
    where:{email},
    raw:true
  })
    .then((user)=>{
      if(user) {
        return done(null, user)
      }
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then((hash)=>{
          return User.create({name, email, password:hash})
        })
        .then((user)=>{
          const {id, name, email} = user
          return done(null, {id, name, email})
        })
    })
    .catch((error)=>{
      error.errorMessage = '登入失敗'
      return done(error)
    })
  return done()
}))

passport.serializeUser((user, done)=>{
  const id = user.id
  return done(null, {id})
})

passport.deserializeUser((user, done)=>{
  const id = user.id
  return User.findOne({
    where:{id},
    raw:true
  })
    .then((user)=>{
      const {id, name, email} = user
      return done(null, {id, name, email})
    })
})

module.exports = passport