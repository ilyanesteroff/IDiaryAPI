const { Follower } = require('../../js/models/Follower')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const findOutIfSomeoneIsBlocked = require('../checks/if-users-blocked')
const findOutIfUserPublic = require('../checks/if-user-is-public')


module.exports = async function(user, userId){
  try {
    !user && throwAnError('Authorization failed', 400) 
    const ifUserFollowsAuthor = await Follower.findFollower(userId, user.username)
    if(!ifUserFollowsAuthor) {
      const ifBlocked = await findOutIfSomeoneIsBlocked(user._id, userId)
      if(ifBlocked) return false
      const ifUserIsPublic = await findOutIfUserPublic(userId)
      if(!ifUserIsPublic) return false
    }
    return true
  } catch(err){
    checkAndThrowError(err)
  }
}