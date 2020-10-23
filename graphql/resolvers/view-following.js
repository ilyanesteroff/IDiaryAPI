const { Follower } = require('../../js/models/Follower')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const ifUserIsAllowedToView = require('./if-user-able-contact')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(userId, field, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
    if(field != 'followers' && field != 'following') throwAnError('field not found', 404)
    if(!userId || userId === client._id) throwAnError('This endpoint is only for viewing someones property, use getFullUser instead', 404)
    const isAllowed = await ifUserIsAllowedToView(client, userId)
    !isAllowed && throwAnError('Not allowed to do this', 400)
    let output
    field === 'followers'
      ? output = await Follower.countFollowers(userId)
      : output = await Follower.countFollowing(userId)
    output.forEach(f => f.followingSince = f.followingSince.toISOString())
    return output
  } catch(err) {
    checkAndThrowError(err)
  }
}