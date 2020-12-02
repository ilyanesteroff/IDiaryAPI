const { User } = require('../../js/models/User')
const { BlockedUser } = require('../../js/models/BlockedUser')
const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const { Todo } = require('../../js/models/Todo')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { Follower } = require('../../js/models/Follower')
const { Request } = require('../../js/models/Request')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const S3 = require('../../assistants/AWS/index')


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
    await Conversation.deleteConversations(client._id)
    await Message.deleteManyMessages(client._id, client.username)
    await S3.deleteFile(client._id)

    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}