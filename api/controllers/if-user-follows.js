const { Follower } = require('../../js/models/Follower')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { userId } = req.body

    const verdict = await Follower.findFollower(userId, user.username)
   
    return verdict
      ? res.status(200).json({ userFollows: verdict._id })
      : res.status(200).json({ userFollows: false })
} catch(err) {
    res.status(500).json({ error: err.massage || 'Something went wrong' })
  }
}