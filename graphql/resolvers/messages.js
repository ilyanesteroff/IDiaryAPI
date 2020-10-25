const { Conversation } = require('../../js/models/Conversation')
const { Message } = require('../../js/models/Message')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(page, convId, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)

    const participants = await Conversation.getSpecificFields(convId, { participants: 1, _id: 0 })
    if(!participants) throwAnError('Conversation not found', 404)
    if(!participants.some(p => p._id === client._id)) throwAnError('Access denied', 400)
    const messages = await Message.findManyMessages({ conversationID: convId }, page, 50)

    messages.forEach(m => {
      m.writtenAt = m.writtenAt.toISOString()
      m._id = m._id.toString()
    })

    return messages
  } catch(err) {
    checkAndThrowError(err)
  }
}
