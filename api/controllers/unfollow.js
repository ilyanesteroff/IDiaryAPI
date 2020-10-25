const { Follower } = require('../../js/models/Follower')
const updateUserActivity = require('../../assistants/update-user-activity')

 
module.exports = async function(req, res){
  try {
    const { user } = req
    const { followId } = req.params
    if(!followId || followId === '') return res.status(400).json({ error: 'Follow ID is missing' })
    
    const follow = await Follower.getSpecificFields(followId, { follower: 1, followingTo: 1, _id: 0 })
    if(!follow) return res.status(404).json({ error: 'Following act not found' })
    if(follow.follower._id !== user._id && follow.followingTo._id !== user._id) return res.status(400).json({ error: 'Operation failed' })
    updateUserActivity(user._id)
    
    await Follower.unfollowOrRemoveFollower(followId)
    
    return res.status(201).json({ unfollowed: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}