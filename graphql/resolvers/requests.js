const { Request } = require('../../js/models/Request')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(incoming, page, client) {
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)

    let requests 
    incoming
      ? requests = await Request.findManyRequestForReceiver(client._id, page, parseInt(process.env.ITEMS_PER_PAGE))
      : requests = await Request.findManyRequestForSender(client._id, page, parseInt(process.env.ITEMS_PER_PAGE))
    requests.forEach(r => {
      r._id = r._id.toString()
      r.sentAt = r.sentAt.toISOString()
    }) 
    
    return requests
  } catch(err) {
    checkAndThrowError(err)
  }
}