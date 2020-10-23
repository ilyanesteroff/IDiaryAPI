const { ObjectID } = require('mongodb')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { Request } = require('../../js/models/Request')
const { Conversation } = require('../../js/models/Conversation')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const followingStats = require('../assistants/follower-stats')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(client){
  try {
    if(!client) throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const userSettings = await UserSettings.getSpecificFields({ _id: new ObjectID(client._id) }, { _id : 0 })
    const userInfo = await UserInfo.getSpecificFields({ _id: new ObjectID(client._id) }, { _id : 0 })
    const stats = followingStats(client._id)
    const followers = (await stats.next()).value
    const following = (await stats.next()).value
    const conversations = await Conversation.countConversations(client._id)
    const incomingRequests = await Request.countIncomingRequests(client._id)
    const outcomingRequests = await Request.countOutcomingRequests(client._id)
    return {
      ...client,
      ...userInfo,
      ...userSettings,
      followers: followers,
      following: following,
      conversations: conversations,
      requestsTo: outcomingRequests,
      requestsFrom: incomingRequests,
      createdAt: user.createdAt.toISOString(), 
    }
  } catch(err) {
    checkAndThrowError(err) 
  }
}