const { User } = require('../../js/models/User')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const someoneBlocked = require('../../assistants/user/if-users-blocked')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(username, client) {
  try{
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const output = await User.getSpecificFields({username: username}, { createdAt: 0, email: 0, password: 0 })
    !output && throwAnError('User not found', 404)
    const ifBlocked = await someoneBlocked(output._id, client._id)
    ifBlocked && throwAnError('User not found', 400)

    return {
      ...output,
      _id: output._id.toString()
    }
  } catch(err){
    checkAndThrowError(err)
  }
}