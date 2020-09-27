const {User} = require('../../js/models/User')
const bycrypt = require('bcryptjs')
const {throwAnError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')

exports.requestPasswordReset = async function(email, req){
  const user = await User.findUser({email: email})
  if(!user) throwAnError('User not found', 404)
  if(user.resetPassword) {
    if(user.resetPassword.bestBefore > new Date()) return true
    else await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" }})
  }
  const token = await randomBytes(20)
  await User.setResetPasswordToken(user._id.toString(), token.toString('hex'))
  return true
}

exports.setNewPassword = async function(token, newPassword, req) { 
  const user = await User.findUser({ "resetPassword.token" : token })
  if(!user) throwAnError('user not found', 404)
  //add resend email
  if(user.resetPassword.bestBefore < new Date()) {
    await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" } })
    const token = await randomBytes(20)
    await User.setResetPasswordToken(user._id.toString(), token.toString('hex'))
    return false
  }
  const hashedPw = await bycrypt.hash(newPassword, 16)
  await User.updateUser(user._id.toString(), { $set : { password : hashedPw }, $unset: { resetPassword : "" } })
  return true
}

exports.getResetPassword = async function(token) {
  const user = await User.findUser({ resetPassword : { token: token } })
  if(!user) throwAnError('User not found', 404)
  if(user.resetPassword.bestBefore < new Date()) {
    User.updateUser(user._id, { $unset: resetPassword })
    return false
  }
  return true 
}