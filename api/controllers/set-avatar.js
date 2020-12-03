const { User } = require('../../js/models/User')

module.exports = async function(req, res){
  try {
    const { user } = req
    const { newUrl } = req.body

    await User.updateUser(user._id, { $set : { avatarUrl: newUrl } })

    return res.status(200).json({ avatarSet: true })
  } catch(err){
    return res.json(500).json({ error: err.message || 'Something broke' })
  }
}