const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {Conversation} = require('../../js/models/Conversation')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')

exports.createConversation = async function(receivers, message, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const groupMembers = []
    for (let r of receivers) {
      let member = (await User.getSpecificFields({ _id: new mongo.ObjectID(r) }, {
        blacklist: 1, public: 1, following: 1, followers: 1, username: 1, firstname: 1, lastname: 1
      }))[0]
      if(!member) throwAnError('User does not exist', 404)
      groupMembers.push(member)
    }
    //test this
    if(groupMembers.some(m => {
      m.blacklist.some(u => u._id === user._id) ||
      (!m.public && !m.following.some(u => u._id === user._id)) && !m.followers.some(u => u._id === user._id)
    })
    ) throwAnError('Cannot contact these users', 422)
    groupMembers.push(user)
    const participants = groupMembers.map(m => User.formatUserAsFollower(m))
  
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
    for await (let p of participants) User.pushSomething(p._id, 'dialogues', Conversation.formatAsDialogue(conversation))
    conversation.messages[0].writtenAt = conversation.messages[0].writtenAt.toISOString()
    return {
      ...conversation,
      _id: conversation._id.toString()
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.writeMessage = async function(text, convId, req) {
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.user._id)) return false
    const messageId = (await randomBytes(12)).toString('hex')
    const message = {id: messageId, author: req.user._id, text: text, writtenAt: new Date()}
    const updatedConv = await Conversation.addMassage(convId, message)
    await User.updateDialogues(Conversation.formatAsDialogue(updatedConv))
    return true
  } catch(err){
    checkAndThrowError(err)
  }
}

exports.updateMessage = async function(text, messageId, convId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.user._id)) throwAnError('User is not allowed to access this converrsation', 400)
    const {messages} = conversation
    let messageIndex = messages.findIndex(m => m.id === messageId)
    if(messageIndex < 0) throwAnError('Message not found', 404)
    if(messages[messageIndex].author !== req.user._id) throwAnError('User is not allowed to modify this message', 400)
    const updatedConv = await Conversation.updateMessage(convId, messageId, text)
    if(messageIndex === messages.length -1) await User.updateDialogues(Conversation.formatAsDialogue(updatedConv))
    return {
      ...updatedConv.messages[messageIndex],
      writtenAt: updatedConv.messages[messageIndex].writtenAt.toISOString()
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.deleteMessage = async function(messageId, convId, req) {
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.user._id)) return false
    let message = conversation.messages.find(m => m.id === messageId)
    if(!message) throwAnError('The message not found', 404)
    if(message.author !== req.user._id) return false
    if(conversation.messages.length === 1) {
      await Conversation.destroyConversation({ _id: new mongo.ObjectID(convId) })
      await User.deleteDialogues(convId)
      return true
    } 
    const updatedConv = await Conversation.deleteMessageForAll(convId, message.id)
    await User.updateDialogues(Conversation.formatAsDialogue(updatedConv))
    return true
  } catch(err) {
    checkAndThrowError(err)
  } 
}