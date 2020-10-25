const { Message } = require('../../js/models/Message')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { messageId, liked } = req.body
    if(!messageId || liked === undefined) return res.status(400).json({ error: 'Something is missing' })
    
    await updateUserActivity(user._id)
    
    const author = await Message.getSpecificFields(messageId, { author: 1, _id: 0 })
    if(author.author === user.username) return res.status(400).json({ error: 'Cannot like your messages' })
    await Message.toggleLikeMessage(messageId, liked)

    return res.status(201).json({ likeToggled: true })
  } catch(err) {
    return req.status(500).json({ error: err.message })
  }
}