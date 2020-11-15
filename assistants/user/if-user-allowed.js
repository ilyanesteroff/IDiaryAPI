const { Follower } = require('../../js/models/Follower')
const findOutIfUserPublic = require('./if-user-is-public')
const findOutIfSomeoneIsBlocked = require('./if-users-blocked')


module.exports = async function(userId, client) {
  try {
    if(!client || !userId) throw new Error('client or user Id was not provided')

    const ifUserFollowsAnotherUser = await Follower.findFollower(userId, client.username)
    
    if(!ifUserFollowsAnotherUser) {
      const ifBlocked = await findOutIfSomeoneIsBlocked(client._id, userId)
      if(ifBlocked) return false
      const ifUserIsPublic = await findOutIfUserPublic(userId)
      if(!ifUserIsPublic) return false
    }

    return true
  } catch(err) {
    return false
  }
}