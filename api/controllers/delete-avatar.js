const { ObjectID } = require('mongodb')
const { User } = require('../../js/models/User')
const S3 = require('../../assistants/AWS/index')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { url } = req.body
    if(!url) return res.status(400).json({ error: 'Url is missing' })

    const _user = await User.getSpecificFields({ _id: new ObjectID(user._id) }, { avatarUrl: 1 })

    if(!_user || !_user.avatarUrl || _user.avatarUrl + process.env.AWS_URL !== url ) 
      return res.status(403).json({ error: 'Forbidden' })

    await S3.deleteFile(_user.avatarUrl)

    await User.updateUser(user._id, { $unset : { avatarUrl: 1 } })

    return res.status(201).json({ deleted: true })
  } catch(err){
    return res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}