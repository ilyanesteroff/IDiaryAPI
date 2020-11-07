const { BlockedUser } = require('../../js/models/BlockedUser') 
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { username } = req.params

    updateUserActivity(user._id)

    if(user.username === username) return res.status(400).json({ error: 'Cannot block/unblock yourself' })
    const blockedUserExist = await BlockedUser.findByUsername(user._id, username)
    if(!blockedUserExist) return res.status(404).json({ error: 'blocked user not found' })
    
    await BlockedUser.unblock(user._id, username)

    return res.status(201).json({ userUnblocked: true })
  } catch(err){
    return res.status(500).json({ error: err.message })
  }
}