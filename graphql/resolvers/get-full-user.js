const { ObjectID } = require('mongodb')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { Request } = require('../../js/models/Request')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const followingStats = require('../assistants/follower-stats')


module.exports = async function(user){
  try {
    if(!user) throwAnError('Authorization failed', 400)
    const userSettings = await UserSettings.getSpecificFields({ _id: new ObjectID(user._id) }, { _id : 0 })
    const userInfo = await UserInfo.getSpecificFields({ _id: new ObjectID(user._id) }, { _id : 0 })
    const stats = followingStats(user._id)
    const followers = (await stats.next()).value
    const following = (await stats.next()).value
    const incomingRequests = await Request.countIncomingRequests(user._id)
    const outcomingRequests = await Request.countOutcomingRequests(user._id)
    return {
      ...user,
      ...userInfo,
      ...userSettings,
      followers: followers,
      following: following,
      requestsTo: outcomingRequests,
      requestsFrom: incomingRequests,
      createdAt: user.createdAt.toISOString(), 
    }
  } catch(err) {
    checkAndThrowError(err) 
  }
}