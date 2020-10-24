const { Message } = require('../../js/models/Message')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(page, convId, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
   
    const messages = await Message.getLikedMessages(convId, page, 50)

    messages.forEach(m => {
      m.writtenAt = m.writtenAt.toISOString()
      m._id = m._id.toString()
    })

    return messages
  } catch(err) {
    checkAndThrowError(err)
  }
}