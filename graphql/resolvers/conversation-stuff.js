const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {Conversation} = require('../../js/models/Conversation')
const {throwAnError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')

exports.createConversation = async function(receiver, message, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = req.user
  const user_receiver = (await User.getSpecificFields({ _id: new mongo.ObjectID(receiver) }, {
    blacklist: 1, public: 1, following: 1, followers: 1, username: 1, firstname: 1, lastname: 1
  }))[0]
  if(!user_receiver) throwAnError('Receiver does not exist')
  //test this
  if(
    user_receiver.blacklist.some(u => u._id === user._id) ||
    (!user_receiver.public && !user_receiver.following.some(u => u._id === user._id)) && !user_receiver.followers.some(u => u._id === user._id)
  ) throwAnError('Cannot contact that user', 422)
  const participants = [User.formatUserAsFollower(user), User.formatUserAsFollower(user_receiver)]
  
  const convAlreadyExists = await Conversation.findDialogue(participants)
  if(convAlreadyExists) throwAnError('Conversation already exists', 400)
  const messageId = (await randomBytes(12)).toString('hex')
  const conversation = new Conversation({
    participants: participants,
    messages: [
      {
        id: messageId, 
        author: user._id,  
        text: message, 
        writtenAt: new Date()
       }
    ]
  })
  await conversation.save()
  await User.pushSomething(user._id, 'dialogues', Conversation.formatAsDialogue(conversation))
  await User.pushSomething(receiver, 'dialogues', Conversation.formatAsDialogue(conversation))
  conversation.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
  return {
    ...conversation
  }
}

exports.writeMessage = async function(to, text, convId, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
  if(!conversation) throwAnError('Conversation not found', 404)
  if(!conversation.participants.some(p => p._id === req.user._id)) return false
  const messageId = (await randomBytes(12)).toString('hex')
  const message = {id: messageId, author: req.user._id, text: text, writtenAt: new Date()}
  const updatedConv = await Conversation.addMassage(convId, message)
  await User.updateDialogues(Conversation.formatAsDialogue(updatedConv))
  return true
}

exports.deleteMessage = async function(messageId, conversationId, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(conversationId)})
  if(!conversation) throwAnError('Conversation not found', 404)
  if(!conversation.participants.some(p => p._id === req.user._id)) return false
  let message = conversation.messages.find(m => m.id === messageId)
  if(!message) return false
  if(message.from !== req.user._id) return false
  if(conversation.messages.length === 1) {
    Conversation.destroyConversation({ _id: new mongo.ObjectID(conversationId) })
    return true
  }
  const updatedConv = await Conversation.deleteMessageForAll(conversationId, message.id)
  await User.updateDialogues(Conversation.formatAsDialogue(updatedConv))
  return true
}