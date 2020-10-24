const { ObjectID } = require('mongodb')
const { User } = require('../../js/models/User')
const { Request } = require('../../js/models/Request')
const { Follower } = require('../../js/models/Follower')
const { BlockedUser } = require('../../js/models/BlockedUser')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(userId, reason, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    await updateUserActivity(client._id)
    client._id === userId && throwAnError('Cannot block yourself', 400)
    const ifUserAlreadyBlocked = await BlockedUser.findById(client._id, userId)
    ifUserAlreadyBlocked && throwAnError('User already blocked', 400)

    const userToBlock = await User.getSpecificFields({ _id: new ObjectID(userId) }, { username: 1, firstname: 1, lastname: 1 })
    if(!userToBlock) throwAnError('User to block not found', 404)
    
    const blockingAction = new BlockedUser({
      blockedUser: { ...userToBlock, _id: userToBlock._id.toString() },
      userWhoBlocked: client._id,
      reason: reason
    })

    await blockingAction.save()
    await Request.handleUserBlocking(client._id, userId)
    await Follower.handleUserBlocking(client._id, userId)
    
    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}