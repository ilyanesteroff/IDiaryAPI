const { UserSettings } = require('../../js/models/UserSettings')
const { Todo } = require('../../js/models/Todo')
const updateUserActivity = require('../../assistants/update-user-activity')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function (userInput, client) {
  try {
    !client && throwAnError('Authorization failed', 400)
    
    updateUserActivity(client._id)

    const updatedUserSettings = await UserSettings.updateUserSettings(client._id, { $set : userInput })
    if(userInput.public !== null) await Todo.updateCreatorPrivacy(client._id, userInput.public)

    return updatedUserSettings
  } catch(err) {
    checkAndThrowError(err)
  }
}