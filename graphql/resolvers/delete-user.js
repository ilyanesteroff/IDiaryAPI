const { User } = require('../../js/models/User')
const { BlockedUser } = require('../../js/models/BlockedUser')
const { Todo } = require('../../js/models/Todo')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { Follower } = require('../../js/models/Follower')
const { Request } = require('../../js/models/Request')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(client){
  try {
    !client && throwAnError('Authorization failed', 400)
    await User.deleteUser(client._id)
    await Todo.deleteTodosOfDeletedUser(client._id)
    await UserInfo.deleteUserInfo(client._id)
    await UserSettings.deleteUserSettings(client._id)
    await Follower.deleteFollowersAndFollowings(client._id)
    await Request.deleteAllRequestsForReceiver(client._id)
    await Request.deleteAllRequestsForSender(client._id)
    await BlockedUser.deleteBlocked(client._id)

    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}