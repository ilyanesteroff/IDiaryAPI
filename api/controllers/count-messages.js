const { Message } = require('../../js/models/Message')


module.exports = async function(req, res){
  try { 
    const { convId } = req.body

    const messages = await Message.countMessages(convId)

    return res.status(200).json({ messages: messages })
  } catch(err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}