const { Follower } = require('../../js/models/Follower')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const ifUserIsAllowedToView = require('../../assistants/user/if-user-allowed')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(userId, page, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)

    if(client._id !== userId){
      const isAllowed = await ifUserIsAllowedToView(userId, client)
      !isAllowed && throwAnError('Not allowed to do this', 400)
    }

    const followings = await Follower.findManyFollowings(userId, page, 200)

    followings.forEach(f => {
      f._id 
      f.user = f.followingTo
      f.followingSince = f.followingSince.toISOString()
    })
    
    return followings
  } catch(err) {
    checkAndThrowError(err)
  }
}