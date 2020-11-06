const { Request } = require('../../js/models/Request')


module.exports = async function(req, res){
  try{
    const { user } = req
    const { userId } = req.body

    const request = await Request.findRequestTo(userId, user.username)
    return request
      ? res.status(200).json({ requestReceived: true, request: request })
      : res.status(200).json({ requestReceived: false })
  } catch(err) {
    return res.status(500).json({ error:  err.message || 'Sometnihg went wrong' })
  }
}