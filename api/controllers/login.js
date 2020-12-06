const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../../js/models/User')
const { UserSettings } = require('../../js/models/UserSettings')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res) {
  try {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({ error: 'something is missing' })

    const user = await User.getSpecificFields({ $or : [{ username: email }, { email: email }]}, { password: 1 , firstname: 1, username: 1 })
    if(!user) return res.status(404).json({ error: 'Email or username is invalid' })
    const ifUserApproved = await UserSettings.getSpecificFields({ _id: user._id }, { approved: 1 })
    if(!ifUserApproved) return res.status(404).json({ error: 'User not found' })
    if(!ifUserApproved.approved) return res.status(400).json({ error: 'Please approve your email' })

    const pwMatches = await bycrypt.compare(password, user.password)
    if(!pwMatches) return res.status(404).json({ error: 'Password is invalid' })
    
    updateUserActivity(user._id.toString())
    const token = jwt.sign({
      userId: user._id.toString()
    }, process.env.JWT_SECRET, { expiresIn : '720h'})

    return res.status(201).json({
      token: token,
      userId: user._id.toString(),
      firstname: user.firstname,
      username: user.username
    })

  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}