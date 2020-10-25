const { Request } = require('../../js/models/Request')
const { Follower } = require('../../js/models/Follower')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res) {
  try {
    const { user } = req
    const { reqId } = req.body
    if(!reqId) return res.status(400).json({ error: 'request ID is missing' })
    updateUserActivity(user._id)

    const request = await Request.findRequestById(reqId)
    if(!request) return res.status(400).json({ error: 'Request not found' })
    const newFollower = new Follower({
      followingTo: request.receiver,
      follower: request.sender,
      followingSince: new Date
    })
    await Request.deleteRequest(reqId)
    await newFollower.save()

    return res.status(201).json({ requestAccepted: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}