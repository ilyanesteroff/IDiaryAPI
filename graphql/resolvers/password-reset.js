const bycrypt = require('bcryptjs')
const {User} = require('../../js/models/User')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')
const {resetPasswordEmail} = require('../assistants/email-sender')

exports.requestPasswordReset = async function(email, req){
  try {
    const user = (await User.getSpecificFields({email: email}, { resetPassword: 1 }))[0]
    if(!user) throwAnError('User not found', 404)
    if(user.resetPassword) {
      if(user.resetPassword.bestBefore > new Date()) return true
      else await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" }})
    }
    const token = (await randomBytes(20)).toString('hex')
    await User.setResetPasswordToken(user._id.toString(), token)
    resetPasswordEmail(email, 'Password reset', token)
    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.setNewPassword = async function(token, newPassword, req) { 
  try {
    const user = (await User.getSpecificFields(
      {"resetPassword.token" : token}, 
      { resetPassword: 1 } 
    ))[0]
    if(!user) throwAnError('user not found', 404)
    await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" } })
    if(user.resetPassword.bestBefore < new Date()) {
      const token = (await randomBytes(20)).toString('hex')
      await User.setResetPasswordToken(user._id.toString(), token)
      resetPasswordEmail(email, 'Password reset', token)
      return false 
    }
    const hashedPw = await bycrypt.hash(newPassword, 16)
    await User.updateUser(user._id.toString(), { $set : { password : hashedPw }})
    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.getResetPassword = async function(token) {
  try {
    const user = (await User.getSpecificFields(
      {"resetPassword.token" : token}, 
      { resetPassword: 1 } 
    ))[0]
    if(!user) throwAnError('User not found', 404)
    if(user.resetPassword.bestBefore < new Date()) {
      User.updateUser(user._id, { $unset: { resetPassword : "" } } )
        return false
    }
    return true 
  } catch(err) {
    checkAndThrowError(err)
  }
}