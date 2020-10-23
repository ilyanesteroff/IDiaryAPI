const { UserSettings } = require('../../js/models/UserSettings')
const updateUserActivity = require('../../assistants/update-user-activity')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function (userInput, client) {
  try {
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
    const updatedUserSettings = await UserSettings.updateUserSettings(client._id, { $set : userInput })
    
    return updatedUserSettings
  } catch(err) {
    checkAndThrowError(err)
  }
}