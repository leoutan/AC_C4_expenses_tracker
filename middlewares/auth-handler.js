module.exports = {
  originAuth: (req, res, next)=>{
    if(req.session.user) {
      return next()
    }
    req.flash('error', '請先登入')
    return res.redirect('/login')
  },
  passportAuth: (req, res, next)=>{
    if(req.isAuthenticated()) {
      return next()
    }
    req.flash('error', '請先登入')
    return res.redirect('/login')
  }
}
