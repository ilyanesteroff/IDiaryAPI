const {User} = require('../../js/models/User')
const mongo = require('mongodb')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secrets} = require('../../js/utils/variables')
const {throwAnError} = require('../../utils/error-handlers')

exports.login = async function(email, password) {
  const user = await User.findUser({ email: email })
  if(!user) throwAnError('Email is invalid', 404)
  const pwMatches = await bycrypt.compare(password, user.password)
  if(!pwMatches) throwAnError('Password is invalid', 401)
  const token = jwt.sign({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  }, secrets.JWT, { expiresIn : '72h'})

  return {
    token: token,
    userId: user._id.toString(),
    username: user.username
  }
}

exports.acceptEmail = async function(token) {
  const user = await User.findUser({ password: token})
  if(!user) throwAnError('User not found or already has been approved', 404)
  if(user.approved) return false
  else if(token === user.password && !user.approved) {
    User.updateUser(user._id.toString(), { $set: { approved: true } })
    return true
  } else return false
}

exports.verifyPassword = async function(password, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  return await bycrypt.compare(password, req.user.password)
}