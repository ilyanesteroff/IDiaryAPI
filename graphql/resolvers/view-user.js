const { ObjectID } = require('mongodb')
const { Follower } = require('../../js/models/Follower')
const { User } = require('../../js/models/User')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const findOutIfSomeoneIsBlocked = require('../checks/if-users-blocked')
const findOutIfUserPublic = require('../checks/if-user-is-public')
const followerStats = require('../assistants/follower-stats')


module.exports = async function(userId, user){
  try {
    !user && throwAnError('Authorization failed')
    const ifUserFollows = await Follower.findFollower(userId, user.username)
    if(!ifUserFollows) {
      await findOutIfSomeoneIsBlocked(user._id, userId) && throwAnError('Unable to view', 400)
      !await findOutIfUserPublic(userId) && throwAnError('User is private', 400)
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