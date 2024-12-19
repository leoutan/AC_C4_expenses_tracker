module.exports = (error, req, res, next)=>{
  req.flash('error', error.errorMessage || '伺服器錯誤')
  console.log(error.message)
  res.redirect('back')
  next(error)
}