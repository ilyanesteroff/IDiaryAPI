const {UserSettings} = require('../../js/models/UserSettings')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')


module.exports = async function(token) {
  try {
    const settings = await UserSettings.getSpecificFields(
      {"resetPassword.token" : token}, 
      { resetPassword: 1 } 
    )
    if(!settings) throwAnError('User not found', 404)
    if(settings.resetPassword.bestBefore < new Date()) {
      UserSettings.updateUserSettings(settings._id, { $unset: { resetPassword : "" } } )
      return false
    }
    return true 
  } catch(err) {
    checkAndThrowError(err)
  }
}