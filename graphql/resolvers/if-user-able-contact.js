const { Follower } = require('../../js/models/Follower')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const findOutIfSomeoneIsBlocked = require('../checks/if-users-blocked')
const findOutIfUserPublic = require('../checks/if-user-is-public')


module.exports = async function(client, userId){
  try {
    !client && throwAnError('Authorization failed', 400) 
    const ifUserFollowsAnotherUser = await Follower.findFollower(userId, client.username)
    if(!ifUserFollowsAnotherUser) {
      const ifBlocked = await findOutIfSomeoneIsBlocked(client._id, userId)
      if(ifBlocked) return false
      const ifUserIsPublic = await findOutIfUserPublic(userId)
      if(!ifUserIsPublic) return false
    }
    return true
  } catch(err){
    checkAndThrowError(err)
  }
}