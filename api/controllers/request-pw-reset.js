const { User } = require('../../js/models/User')
const { UserSettings } = require('../../js/models/UserSettings')
const { resetPasswordEmail } = require('../../assistants/email-sender')
const randomBytes = require('../../assistants/random-bytes')


module.exports = async function(req, res){
  try {
    const { field } = req.body
    if(!field) return res.status(400).json({ error: 'Field is missing' })

    const user = await User.getSpecificFields({ $or : [ { username: field }, { email: field } ]}, { email: 1 })
    if(!user) return res.status(404).json({ error: 'User not found' })
    
    const userSettings = await UserSettings.getSpecificFields({ _id : user._id}, { approved: 1, resetPassword: 1, _id: 0 })
    if(!userSettings.approved) return res.status(400).json({ requested: false })

    if(userSettings.resetPassword) {
      if(userSettings.resetPassword.bestBefore > new Date().getTime()) return res.json({ requested: true })
      else await UserSettings.unsetResetPasswordToken(user._id.toString())
    }
    
    const token = (await randomBytes(20)).toString('hex')
    await UserSettings.setResetPasswordToken(user._id.toString(), token)
    resetPasswordEmail(user.email, 'Password reset', token)

    return res.status(201).json({ requested: true })
  } catch(err) {
    return res.status(500).json({ error: err.massage || 'Something went wrong' })
  }
}
  