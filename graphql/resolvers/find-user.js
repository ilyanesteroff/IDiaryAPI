const { User } = require('../../js/models/User')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const someoneBlocked = require('../checks/if-users-blocked')


module.exports = async function(username, user) {
  try{
    !user && throwAnError('Authorization failed', 400)

    const output = await User.getSpecificFields({username: username}, { createdAt: 0, email: 0, password: 0 })
    !output && throwAnError('User not found', 404)
    const ifBlocked = await someoneBlocked(output._id, user._id)
    ifBlocked && throwAnError('User not found', 400)

    return {
      ...output,
      _id: output._id.toString()
    }
  } catch(err){
    checkAndThrowError(err)
  }
}