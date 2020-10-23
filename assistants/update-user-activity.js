const { UserInfo } = require('../js/models/UserInfo')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(userId) {
  try {
    !userId && throwAnError('user ID was not provided', 400)
    await UserInfo.setLastSeen(userId)

  } catch (err) {
    checkAndThrowError(err)
  }
}