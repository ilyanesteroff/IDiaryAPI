const { ObjectID } = require('mongodb')
const { User } = require('../../js/models/User')
const { Request } = require('../../js/models/Request')
const { Follower } = require('../../js/models/Follower')
const { BlockedUser } = require('../../js/models/BlockedUser')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { userId } = req.body
    if(!reason || !userId) return res.status(400).json({ error: 'Something is missing' })

    if(user._id === userId) return res.status(400).json({ error: 'Cannot block yourself' })
    updateUserActivity(user._id)

    const userAlreadyBlocked = await BlockedUser.findById(user._id, userId)
    if(userAlreadyBlocked) return res.status(400).json({ error: 'User already had been blocked' })

    const userToBlock = await User.getSpecificFields({ _id: new ObjectID(userId) }, { username: 1, firstname: 1, lastname: 1 })
    if(!userToBlock) return res.status(404).json({ error: 'User to block not found' })
    
    const blockingAction = new BlockedUser({
      blockedUser: { ...userToBlock, _id: userToBlock._id.toString() },
      userWhoBlocked: user._id
    })

    await blockingAction.save()
    await Request.handleUserBlocking(user._id, userId)
    await Follower.handleUserBlocking(user._id, userId)
    
    return res.status(201).json({ userBlocked: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}