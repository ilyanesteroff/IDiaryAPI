const { Request } = require('../../js/models/Request')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { userId } = req.body

    const request = await Request.findRequestFrom(userId, user.username)
    return request
      ? res.status(200).json({ requestSent: true, request: request._id })
      : res.status(200).json({ requestSent: false })
  } catch(err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}