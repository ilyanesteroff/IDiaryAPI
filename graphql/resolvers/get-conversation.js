const { Conversation } = require('../../js/models/Conversation')
const { Message } = require('../../js/models/Message')
const { User } = require('../../js/models/User')
const ifUserAllowed = require('../../assistants/user/if-user-allowed')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(username, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    
    updateUserActivity(client._id)

    const userExists = await User.getSpecificFields({ username: username }, { _id: 1 })
    if(!userExists) return { ifUserAllowed: false }

    const allowed = await ifUserAllowed(userExists._id, client)
    if(!allowed) return { ifUserAllowed: false }

    const conv = await Conversation.getConversationByUserneme(username, client._id)
    if(!conv) return { exists: false, ifUserAllowed: true }
    const messages = await Message.findManyMessages({ conversationID: conv._id.toString() }, 1, 20)
    
    messages.forEach(m => {
      m.writtenAt = m.writtenAt.toISOString()
      m._id = m._id.toString()
    })

    return {
      conversation: {
        ...conv,
        _id: conv._id.toString(),
        updatedAt: conv.updatedAt.toISOString(),
        latestMessage: {
          ...conv.latestMessage,
          writtenAt: conv.latestMessage.writtenAt.toISOString()
        }
      },
      messages: messages,
      exists: true,
      ifUserAllowed: true
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}