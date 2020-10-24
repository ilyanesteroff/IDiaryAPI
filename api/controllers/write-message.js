const { Message } = require('../../js/models/Message')
const { Conversation } = require('../../js/models/Conversation')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { text, convId } = req.body
    await updateUserActivity(user._id)

    const message = new Message({
      text: text,
      conversationID: convId,
      author: user.username
    })

    const savedMessage = await message.save()
    await Conversation.setAnotherLatestMessage(convId, savedMessage)

    return res.status(201).json({ messageWritten: true })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}