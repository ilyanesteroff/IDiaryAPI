const { Request } = require('../../js/models/Request')
const { Follower } = require('../../js/models/Follower')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res) {
  try {
    const { user } = req
    const { reqId } = req.body
    if(!reqId) return res.status(400).json({ error: 'Request ID is missing' })

    const request = await Request.getSpecificFields(reqId, { sender: 1, receiver: 1, _id: 0 })
    if(!request) return res.status(400).json({ error: 'Request not found' })
    if(request.receiver._id !== user._id) return res.status(400).json({ error: 'Cannot accept requests of another user' })
    
    updateUserActivity(user._id)

    const newFollower = new Follower({
      followingTo: request.receiver,
      follower: request.sender,
      followingSince: new Date()
    })
    await Request.deleteRequest(reqId)
    await newFollower.save()

    return res.status(201).json({ requestAccepted: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}