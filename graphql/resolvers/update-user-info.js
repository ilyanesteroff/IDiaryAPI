const { UserInfo } = require('../../js/models/UserInfo')
const updateUserActivity = require('../../assistants/update-user-activity')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function (userInput, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
    const updatedUserInfo = await UserInfo.updateUserInfo(client._id, { $set : userInput })
   
    return updatedUserInfo
  } catch(err) {
    checkAndThrowError(err)
  }
}