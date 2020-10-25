const { User } = require('../../js/models/User')
const { UserSettings } = require('../../js/models/UserSettings')


module.exports = async function(req, res) {
  try {
    const { token } = req.body
    if(!token) return res.status(400).json({ error: 'Token is missing' })
    
    const user = await UserSettings.getSpecificFields({ approveEmailToken: token }, { approveEmailToken: 1, approved: 1 })
    if(!user) return res.status(404).json({ error: 'user not found'})
    if(user.approved) return res.status(400).json({ error: 'User has been approved' })

    else if(token === user.approveEmailToken) {
      await UserSettings.acceptEmail(user._id.toString())
      const token = jwt.sign({
        userId: user._id.toString()
      }, process.env.JWT_SECRET, { expiresIn : '720h'})
      const firstname = await User.getSpecificFields({ _id: user._id }, { firstname: 1 })
      return res.status(201).json({
        token: token,
        userId: user._id.toString(),
        firstname: firstname.firstname
      })
    } else return res.status(400).json({ error: 'Token is invalid' })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}