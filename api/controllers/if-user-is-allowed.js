const ifUserAllowed = require('../../assistants/user/if-user-allowed')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { userId } = req.body
    if(!userId) return res.status(400).json({ error: 'User ID is missing' })
    const verdict = await ifUserAllowed(userId, user)

    return res.status(200).json({ userAllowedTocontact: verdict })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}