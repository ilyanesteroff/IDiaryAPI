const { Request } = require('../../js/models/Request')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { reqId } = req.params

    const request = await Request.getSpecificFields(reqId, { sender: 1, _id: 0 })
    if(!request) return res.status(404).json({ error: 'Request not found' })
    if(request.sender._id !== user._id) return res.status(400).json({ error: 'Cannot unsend request of another user' })
    
    updateUserActivity(user._id)
    
    await Request.deleteRequest(reqId)
    
    return res.status(201).json({ requestCancelled: true })    
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}
  