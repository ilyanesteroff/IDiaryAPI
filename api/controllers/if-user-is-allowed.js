const ifUserAllowed = require('../../assistants/user/if-user-allowed')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { userId } = req.body
    
    const verdict = await ifUserAllowed(userId, user)

    return res.status(200).json({ userAllowedTocontact: verdict })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}