const { User } = require('../../js/models/User')


module.exports = async function (req, res){
  try {
    const { email, username } = req.body
    if(!email || !username) return res.status(400).json({ error: 'Something is missing' })
    const user = await User.getSpecificFields({$or: [{email: email}, {username: username}]}, { _id : 1 })
    
    return res.status(200).json({ userExists: !(user === undefined) })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}