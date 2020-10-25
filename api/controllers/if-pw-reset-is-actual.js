const { UserSettings } = require('../../js/models/UserSettings')


module.exports = async function(req, res) {
  try {
    const { token } = req.body
    if(!token) return res.status(400).json({ error: 'Token is missing' })
    
    const settings = await UserSettings.getSpecificFields(
      {"resetPassword.token" : token}, 
      { resetPassword: 1 } 
    )
    if(!settings) return res.status(404).json('User not found')
    if(settings.resetPassword.bestBefore < new Date()) await UserSettings.updateUserSettings(settings._id, { $unset: { resetPassword : "" } } )

    return res.status(200).json({ resetPasswordIsaActual: settings.resetPassword.bestBefore < new Date() })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}