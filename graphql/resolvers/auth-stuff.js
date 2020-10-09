const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const {User} = require('../../js/models/User')

exports.login = async function(email, password) {
  try {
    const user = (await User.getSpecificFields({ email: email }, {password: 1, firstname: 1, email: 1, approved: 1}))[0]
    if(!user) throwAnError('Email is invalid', 404)
    if(!user.approved) throwAnError('Please approve your email', 400)
    const pwMatches = await bycrypt.compare(password, user.password)
    if(!pwMatches) throwAnError('Password is invalid', 401)
    const token = jwt.sign({
      userId: user._id.toString()
    }, process.env.JWT_SECRET, { expiresIn : '720h'})

    return {
      token: token,
      userId: user._id.toString(),
      firstname: user.firstname
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.acceptEmail = async function(token) {
  try {
    const user = (await User.getSpecificFields({ approveEmailToken: token}, { approved: 1, approveEmailToken: 1, firstname: 1 }))[0]
    if(!user) throwAnError('User not found or already has been approved', 404)
    if(user.approved) throwAnError('User has been approved', 400)
    else if(token === user.approveEmailToken) {
      User.updateUser(user._id.toString(), { $set: { approved: true }, $unset: { approveEmailToken: "" } })
      const token = jwt.sign({
        userId: user._id.toString()
      }, process.env.JWT_SECRET, { expiresIn : '720h'})
      return {
        token: token,
        userId: user._id.toString(),
        firstname: user.firstname
      }
    } else throwAnError('Token is invalid', 400)
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