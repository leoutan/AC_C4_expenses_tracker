module.exports = (req, res, next)=>{
  if(req.session.user) {
    return next()
  }
  req.flash('error', '請先登入')
  return res.redirect('/login')
}