const { Conversation } = require('../../js/models/Conversation')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(client, page) {
  try{
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
    const conversations = await Conversation.findManyConversationsForOneUser(client._id, page, 20)

    conversations.forEach(conv => {
      conv._id = conv._id.toString()
      conv.updatedAt = conv.updatedAt.toISOString()
      conv.latestMessage = {
        ...conv.latestMessage,
        _id: conv.latestMessage._id.toString(),
        writtenAt: conv.latestMessage.writtenAt.toISOString()
      }
    })

    return conversations
  } catch (err) {
    checkAndThrowError(err)
  }
}