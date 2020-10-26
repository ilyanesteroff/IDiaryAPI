const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const updateUserActivity = require('../../assistants/update-user-activity')
const ifSomeoneIsBlocked = require('../../assistants/user/if-users-blocked')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { text, to, convId } = req.body
    if(!text || !to || !convId) return res.status(400).json({ error: 'Something is missing' })

    updateUserActivity(user._id)

    const ifUserCanWriteMessage = await ifSomeoneIsBlocked(user._id, to)
    if(ifUserCanWriteMessage) return res.status(400).json({ error: 'User not allowed to write' })

    const message = new Message({
      text: text,
      conversationID: convId,
      author: user.username,
      to: to
    })

    const savedMessage = await message.save()
    await Conversation.setAnotherLatestMessage(convId, savedMessage)
    await Conversation.increaseUnseenMessages(convId.toString())

    return res.status(201).json({ messageWritten: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}