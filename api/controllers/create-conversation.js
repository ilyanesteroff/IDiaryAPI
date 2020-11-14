const { ObjectID } = require('mongodb')
const { Conversation } = require('../../js/models/Conversation')
const { User } = require('../../js/models/User')
const { Message } = require('../../js/models/Message')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { receiver, messageText } = req.body
    if(!receiver || !messageText) return res.status(400).json({ error: 'Something is missing' })
    if(receiver === user._id) return res.status(400).json({ error: 'Cannot contact yourself' })
    
    updateUserActivity(user._id)

    const user2 = await User.getSpecificFields({ _id: new ObjectID(receiver) }, { username: 1, lastname: 1, firstname: 1})
    const conversation = new Conversation({
      participants: [
        User.formatUserAsFollower(user),
        { ...user2, _id: user2._id.toString() }
      ]
    })

    const savedConv = await conversation.save()

    const firstMessage = new Message({
      conversationID: savedConv._id.toString(),
      author: user.username,
      text: messageText, 
      to: receiver
    })

    const savedMessage = await firstMessage.save()

    await Conversation.setAnotherLatestMessage(savedConv._id.toString(), { ...savedMessage, _id: savedMessage._id.toString() })
    const conv = await Conversation.increaseUnseenMessages(savedConv._id.toString())

    return res.status(201).json({ conversationCreated: conv })

  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}