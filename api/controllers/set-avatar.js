const { ObjectID } = require('mongodb')
const { User } = require('../../js/models/User')
const S3 = require('../../assistants/AWS/index')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { newUrl } = req.body

    const ifExists = await User.getSpecificFields({ _id: new ObjectID(user._id) }, { avatarUrl: 1 })

    if(ifExists.avatarUrl) await S3.deleteFile(ifExists.avatarUrl)

    await User.updateUser(user._id, { $set : { avatarUrl: newUrl } })

    return res.status(200).json({ avatarSet: true })
  } catch(err){
    return res.json(500).json({ error: err.message || 'Something broke' })
  }
}