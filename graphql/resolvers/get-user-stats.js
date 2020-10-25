const { Request } = require('../../js/models/Request')
const { Message } = require('../../js/models/Message')
const updateUserActivity = require('../../assistants/update-user-activity')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    
    const requests = await Request.countIncomingRequests(client._id)
    const unseenMessages = await Message.countUnseenMessages(client._id)

    return {
      incomingRequests: requests,
      unseenMessages: unseenMessages
    }

  } catch(err) {
    checkAndThrowError(err)
  }
}