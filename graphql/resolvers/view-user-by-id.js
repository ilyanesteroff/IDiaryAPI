const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')
const userDataManager = require('../assistants/handle-user-data')


module.exports = async function(userId, client){
  try {
    !client && throwAnError('Authorization failed', 400)

    updateUserActivity(client._id)

    return userDataManager(userId, client)
  } catch(err) {
    checkAndThrowError(err) 
  }
}