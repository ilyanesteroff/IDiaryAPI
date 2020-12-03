const S3 = require('../../assistants/AWS/index')
const randomBytes = require('../../assistants/random-bytes')


module.exports = async function (req, res){
  try {
    const { user } = req
    
    const imgID = (await randomBytes(16)).toString('hex')

    const key = `${user._id}/${imgID}.jpeg`

    const url = await S3.getURL(key)

    return url 
      ? res.status(200).json({ key, url })
      : res.status(500).json({ error: err.message || 'Something went wrong' })
  } catch(err){
    return res.status(500).json({ error: err.message || 'Something went wrong' })
  }
} 