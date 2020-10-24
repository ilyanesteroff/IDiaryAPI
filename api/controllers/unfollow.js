const { Follower } = require('../../js/models/Follower')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { followId } = req.params
    updateUserActivity(user._id)

    await Follower.unfollowOrRemoveFollower(followId)
    
    return res.status(201).json({ unfollowed: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}