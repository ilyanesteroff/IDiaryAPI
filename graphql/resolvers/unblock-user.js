const { BlockedUser } = require('../../js/models/BlockedUser') 
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function(username, client){
  try{
    !client && throwAnError('Authorization failed', 400)

    if(client.username === username) throwAnError('Cannot block/ unblock yourself', 400)
    const ifBlockedUserExist = await BlockedUser.findByUsername(client._id, username)
    !ifBlockedUserExist && throwAnError('User to unblock not found', 404)

    await BlockedUser.unblock(client._id, username)

    return true
  } catch(err){
    checkAndThrowError(err)
  }
}