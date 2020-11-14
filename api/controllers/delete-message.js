const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try{
    const { user } = req
    const { messageId } = req.params
    if(!messageId || messageId === '') return res.status(400).json({ error: 'Message ID is missing' })
    
    updateUserActivity(user._id)

    const message = await Message.getSpecificFields(messageId, { author: 1, conversationID: 1, seen: 1, _id: 0 })
    if(!message) return res.status(404).json({ error: 'Message not found' })
    if(message.author !== user.username) return res.status(400).json({ error: 'Canot delete message of another user' })
    await Message.deleteMessage(messageId)
    const latestMessage = await Message.getLatestMessage(message.conversationID)
    if(!latestMessage){
      await Conversation.destroyConversation(message.conversationID)
      return res.status(201).json({ messageDeleted: true, conversationDeleted: true })
    }
    const updatedAt = await Conversation.getSpecificFields(message.conversationID, { updatedAt: 1, _id: 0 })
    if(!message.seen) await Conversation.decreaseUnseenMessages(messageId.conversationID)
    
    await Conversation.setAnotherLatestMessage(message.conversationID, { ...latestMessage, _id: latestMessage._id.toString() }, updatedAt.updatedAt)
    
    const conv = await Conversation.getConversation(message.conversationID)

    return res.status(201).json({ messageDeleted: true, conversation: conv })
  } catch(err){
    return res.status(500).json({ error: err.message})
  }
}