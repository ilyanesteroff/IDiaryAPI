const { User } = require('../../js/models/User')


module.exports = async function (req, res){
  try {
    const { field } = req.body
    if(!field) return res.status(400).json({ error: 'Field is missing' })
    const user = await User.getSpecificFields({$or: [{email: field}, {username: field}]}, { _id : 1 })
    
    return res.status(200).json({ userExists: !(user === undefined) })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}