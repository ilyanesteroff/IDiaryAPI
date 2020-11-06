const { ObjectID } = require('mongodb')
const { Follower } = require('../../js/models/Follower')
const { User } = require('../../js/models/User')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const findOutIfSomeoneIsBlocked = require('../../assistants/user/if-users-blocked')
const followerStats = require('../assistants/follower-stats')
const updateUserActivity = require('../../assistants/update-user-activity')
const ifUserIsPublic = require('../../assistants/user/if-user-is-public')


module.exports = async function(userId, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    userId === client._id && throwAnError('Use fullUser endpoint instead', 400)
    updateUserActivity(client._id)
    const ifUserFollows = await Follower.findFollower(userId, client.username)

    if(!ifUserFollows) {
      await findOutIfSomeoneIsBlocked(client._id, userId) && throwAnError('Unable to view', 400)
      const userIsPublic = await ifUserIsPublic(userId)
      if(!userIsPublic) {
        let userToView = await User.getSpecificFields({ _id: new ObjectID(userId)}, { password: 0, _id: 0 })
        let userIsPublic = await UserSettings.getSpecificFields({ _id: new ObjectID(userId) }, { public : 1, _id: 0 })
        let lastSeen = await UserInfo.getSpecificFields({ _id: new ObjectID(userId) }, { _id: 0, lastSeen: 1 })
        return {
          ...userToView,
          ...userIsPublic,
          _id: userId,
          lastSeen: lastSeen.toISOString()
        }
      }
    }

    const userToView = await User.getSpecificFields({ _id: new ObjectID(userId)}, { password: 0, _id: 0 })
    const userIsPublic = await UserSettings.getSpecificFields({ _id: new ObjectID(userId) }, { public : 1, _id: 0 })
    const userInfo = await UserInfo.getSpecificFields({ _id: new ObjectID(userId) }, { _id: 0 })
    const stats = followerStats(userId)
    const followers = (await stats.next()).value
    const following = (await stats.next()).value

    return {
      ...userToView,
      ...userIsPublic,
      ...userInfo,
      _id: userId,
      createdAt: userToView.createdAt.toISOString(),
      followers: followers,
      following: following
    }
  } catch(err) {
    checkAndThrowError(err) 
  }
}