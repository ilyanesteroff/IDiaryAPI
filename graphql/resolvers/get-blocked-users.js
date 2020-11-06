const { BlockedUser } = require('../../js/models/BlockedUser')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(page, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    
    const blockedUsers = await BlockedUser.findManyBlockedUsers(client._id, page, parseInt(process.env.ITEMS_PER_PAGE))

    return blockedUsers
  } catch(err) {
    checkAndThrowError(err)
  }
}