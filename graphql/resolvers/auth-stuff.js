const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const {secrets} = require('../../js/utils/variables')
const {User} = require('../../js/models/User')

exports.login = async function(email, password) {
  try {
    const user = (await User.getSpecificFields({ email: email }, {password: 1, username: 1, email: 1}))[0]
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
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.acceptEmail = async function(token) {
  try {
    const user = (await User.getSpecificFields({ approveEmailToken: token}, { approved: 1, approveEmailToken: 1 }))[0]
    if(!user) throwAnError('User not found or already has been approved', 404)
    if(user.approved) return false
    else if(token === user.approveEmailToken && !user.approved) {
      User.updateUser(user._id.toString(), { $set: { approved: true }, $unset: { approveEmailToken: "" } })
      return true
    } else return false
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.verifyPassword = async function(password, req) {
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    return await bycrypt.compare(password, req.user.password)
  } catch(err){
    checkAndThrowError(err)
  }
}