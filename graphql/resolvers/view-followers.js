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

    const followers = await Follower.findManyFollowers(userId, page, 20/*parseInt(process.env.ITEMS_PER_PAGE)*/)

    followers.forEach(f => {
      f._id 
      f.user = f.follower
      f.followingSince = f.followingSince.toISOString()
    })
    
    return followers
  } catch(err) {
    checkAndThrowError(err)
  }
}