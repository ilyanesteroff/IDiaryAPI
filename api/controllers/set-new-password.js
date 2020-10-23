const bycrypt = require('bcryptjs')
const { UserSettings } = require('../../js/models/UserSettings')
const { User } = require('../../js/models/User')


module.exports = async function(req, res) { 
  try {
    const { token , newPassword } = req.body
   
    const passwordReset = await UserSettings.getSpecificFields({ "resetPassword.token" : token }, { resetPassword: 1 })
    if(!passwordReset) return res.status(404).json({ error: 'User not found' })

    await UserSettings.updateUserSettings(passwordReset._id.toString(), { $unset: { resetPassword : "" } })
    if(passwordReset.resetPassword.bestBefore < new Date()) return res.status(200).json({ reset: false })
    
    const hashedPw = await bycrypt.hash(newPassword, 16)
    await User.updateUser(passwordReset._id.toString(), { $set : { password : hashedPw }})

    return res.status(200).json({ reset: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}