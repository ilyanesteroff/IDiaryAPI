const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {Conversation} = require('../../js/models/Conversation')
const {throwAnError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')

exports.createConversation = async function(receiver, message, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = req.user
  const user_receiver = await User.findUser({ _id: new mongo.ObjectID(receiver) })
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
        from: user._id, 
        to: receiver, 
        text: message, 
        writtenAt: new Date()
       }
    ]
  })
  await conversation.save()
  conversation.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
  await User.pushSomething(user._id, 'dialogues', Conversation.formatAsDialogue(conversation))
  await User.pushSomething(receiver, 'dialogues', Conversation.formatAsDialogue(conversation))
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
  const message = {id: messageId, from: req.user._id, to: to, text: text, writtenAt: new Date()}
  const updatedConv = await Conversation.addMassage(convId, message)
  await User.pullSomething(req.user._id, 'dialogues', { _id: convId })
  await User.pullSomething(to, 'dialogues', { _id: convId })
  await User.pushSomething(req.user._id, 'dialogues', Conversation.formatAsDialogue(updatedConv))
  await User.pushSomething(to, 'dialogues', Conversation.formatAsDialogue(updatedConv))
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
  //supposed for conversations with only 2 participants
  await User.pullSomething(conversation.participants[0]._id, 'dialogues', { _id: conversationId })
  await User.pullSomething(conversation.participants[1]._id, 'dialogues', { _id: conversationId })
  if(conversation.messages.length === 1) {
    Conversation.destroyConversation({ _id: new mongo.ObjectID(conversationId) })
    return true
  }
  const updatedConv = await Conversation.deleteMessageForAll(conversationId, message.id)
  //will be replaced in the future
  await User.pushSomething(conversation.participants[0]._id, 'dialogues', Conversation.formatAsDialogue(updatedConv))
  await User.pushSomething(conversation.participants[1]._id, 'dialogues', Conversation.formatAsDialogue(updatedConv))
  return true
}