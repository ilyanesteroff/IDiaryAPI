const { Follower } = require('../../js/models/Follower')
const { User } = require('../../js/models/User')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const findOutIfSomeoneIsBlocked = require('../../assistants/user/if-users-blocked')
const followerStats = require('../assistants/follower-stats')
const updateUserActivity = require('../../assistants/update-user-activity')
const ifUserIsPublic = require('../../assistants/user/if-user-is-public')


module.exports = async function(username, client){
  try {
    !client && throwAnError('Authorization failed', 400)

    updateUserActivity(client._id)

    const userId = await User.getSpecificFields({ username: username }, { _id: 1 })

    if(userId._id.toString() !== client._id){
      const ifUserFollows = await Follower.findFollower(userId._id.toString(), client.username)

      if(!ifUserFollows) {
        await findOutIfSomeoneIsBlocked(client._id, userId._id.toString()) && throwAnError('Unable to view', 400)
        const userIsPublic = await ifUserIsPublic(userId._id.toString())
        if(!userIsPublic) {
          let userToView = await User.getSpecificFields({ _id: userId._id }, { password: 0, _id: 0 })
          let userIsPublic = await UserSettings.getSpecificFields({ _id: userId._id }, { public : 1, _id: 0 })
          let lastSeen = await UserInfo.getSpecificFields({ _id: userId._id }, { _id: 0, lastSeen: 1 })
          return {
            ...userToView,
            ...userIsPublic,
            _id: userId._id.toString(),
            lastSeen: lastSeen.lastSeen.toISOString(),
            createdAt: userToView.createdAt.toISOString()
          }
        }
      }
    }

    const userToView = await User.getSpecificFields({ _id: userId._id }, { password: 0, _id: 0 })
    const userIsPublic = await UserSettings.getSpecificFields({ _id: userId._id }, { public : 1, _id: 0 })
    const userInfo = await UserInfo.getSpecificFields({ _id: userId._id }, { _id: 0 })
    const stats = followerStats(userId._id.toString())
    const followers = (await stats.next()).value
    const following = (await stats.next()).value

    return {
      ...userToView,
      ...userIsPublic,
      ...userInfo,
      _id: userId._id.toString(),
      lastSeen: userInfo.lastSeen.toISOString(),
      createdAt: userToView.createdAt.toISOString(),
      followers: followers,
      following: following
    }
  } catch(err) {
    checkAndThrowError(err) 
  }
}