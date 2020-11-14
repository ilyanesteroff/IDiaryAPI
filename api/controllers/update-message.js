const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { messageId, newText } = req.body
    if(!messageId || !newText) return res.status(400).json({ error: 'Something is missing' })

    const message = await Message.getSpecificFields(messageId, { author: 1, _id: 0 })
    if(!message) return res.status(404).json({ error: 'Message not found' })
    if(message.author !== user.username) return res.status(400).json({ error: 'Connot modify messages of anther user' })

    updateUserActivity(user._id)
    
    const updatedMessage = await Message.changeMessageText(messageId, newText)
    const conversation = await Conversation.getSpecificFields(updatedMessage.conversationID, { latestMessage: 1, updatedAt: 1 })
    if(!conversation) return res.status(404).json({ error: 'Conversation not found' })
    let conv = null

    if(conversation.latestMessage._id === messageId) {
      await Conversation.setAnotherLatestMessage(updatedMessage.conversationID, { ...updatedMessage, _id: updatedMessage._id.toString() }, conversation.updatedAt)
      conv = await Conversation.getConversation(updatedMessage.conversationID)
    }

    return res.status(201).json({ messageUpdated: true, conversation: conv })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}