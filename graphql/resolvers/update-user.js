const bycrypt = require('bcryptjs')
const { User } = require('../../js/models/User')
const { Todo } = require('../../js/models/Todo')
const { Request } = require('../../js/models/Request')
const { Follower } = require('../../js/models/Follower')
const { Conversation } = require('../../js/models/Conversation')
const { Message } = require('../../js/models/Message')
const { BlockedUser } = require('../../js/models/BlockedUser')
const updateUserActivity = require('../../assistants/update-user-activity')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(userInput, client){
  try {      
    !client && throwAnError('Authorization failed', 400)

    updateUserActivity(client._id)
    if(userInput.password) userInput.password = await bycrypt.hash(userInput.password, 16)
    const updatedUser = await User.updateUser(client._id, { $set: userInput })
    const shortUser = User.formatUserAsFollower(updatedUser)
    await Request.updateReceiverForManyRequests(client._id, shortUser)
    await Request.updateSenderForManyRequests(client._id, shortUser)
    await Follower.updateFollower(client._id, shortUser)
    await Follower.updateFollowing(client._id, shortUser)
    await Conversation.updateUserInManyConversations(client._id, shortUser)
    await BlockedUser.updateBlockedUsers(client._id, shortUser)
    if(userInput.username && userInput.username !== client.username){
      await Message.updateAuthorInManyMassages(client.username, userInput.username)
      await Todo.updateCreatorName(client._id, userInput.username)
    }

    return updatedUser
  } catch(err) {
    checkAndThrowError(err)
  }
}