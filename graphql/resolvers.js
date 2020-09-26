const crypto = require('crypto')
const { promisify } = require('util')
const mongo = require('mongodb')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const {Todo} = require('../models/Todo')
const {Conversation} = require('../models/Conversation')
const {secrets} = require('../utils/variables')
const {throwAnError} = require('../utils/error-handlers')

const randomBytes = promisify(crypto.randomBytes)
module.exports = {
  getAuthUser: async function(args, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id : new mongo.ObjectID(req.userId)})
    return {
      ...user,
      createdAt: user.createdAt.toISOString()
    }
  },
  checkEmailAndUsername: async function({email, username}){
    const user = await User.findUser({$or: [{email: email}, {username: username}]})
    return !user
      ? false
      : true
  },
  //checks whether password reset is still actual
  getResetPassword: async function({token}) {
    const user = await User.findUser({ resetPassword : { token: token} })
    if(!user) throwAnError('User not found', 404)
    if(user.resetPassword.bestBefore < new Date()) {
      User.updateUser(user._id, { $unset: resetPassword })
      return false
    }
    return true 
  },
  login: async function({email, password}) {
    const user = await User.findUser({ email: email })
    if(!user) throwAnError('Email is invalid', 404)
    const pwMatches = await bycrypt.compare(password, user.password)
    if(!pwMatches) throwAnError('Password is invalid', 401)
    const token = jwt.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    }, secrets.JWT, { expiresIn : '72h'})

    return {
      token: token,
      userId: user._id.toString(),
      username: user.username
    }
  },
  todos: async function({userId}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    const todos = await Todo.findManyTodos({ creatorId: userId || req.userId })
    if(todos.length === 0) return []
    if(userId) {
      _todos = todos.filter(t => t.public)
      _todos.forEach(t => {
        t._id = t._id.toString()
        t.creatorId = t.creatorId.toString()
        t.createdAt = t.createdAt.toISOString()
      })
      return _todos
    } else {
      todos.forEach(t => {
        t._id = t._id.toString()
        t.creatorId = t.creatorId.toString()
        t.createdAt = t.createdAt.toISOString()
      })
      return todos
    }
  },
  todo: async function({todoId}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(!todo) throwAnError('Todo not found', 404)
    if(!todo.public &&  todo.creatorId !== req.userId) throwAnError('Cannot access todo', 400)
    return {
      ...todo,
      _id: todo._id.toString(),
      createdAt: todo.createdAt.toISOString()
    }
  },
  user: async function({userId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(!userId) return { ...user, createdAt: user.createdAt.toISOString() }
    else {
      if(user.blacklist.findIndex(f => f._id === userId) > -1) throwAnError('Forbidden', 400)
      const userToView = await User.findUser({ _id: new mongo.ObjectID(userId)})
      if (
        !userToView.public && 
        userToView.followers.findIndex(f => f._id === req.userId) < 0 &&
        userToView.following.findIndex(f => f._id === req.userId) < 0
      ) return { ...User.formatUserAsFollower(userToView), public: userToView.public }
      return { ...userToView, createdAt: userToView.createdAt.toISOString() }
    }
  },
  //returns a user when searching for users
  findUser: async function({username}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({username: username})
    if(!user) throwAnError('User not found', 404)
    return {
      ...user,
      _id: user._id.toString()
    }
  },
  //fetching who follows users or whom user is following
  followingOrFollowers: async function({userId, field}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(userId || req.userId)})
    if(!user) throwAnError('User not found', 404)
    return user[field]
  },
  conversation: async function({convId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conv = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conv) throwAnError('Conversation not found', 404)
    if(!conv.participants.some(p => p._id === req.userId)) throwAnError('Not allowed to access this conversation', 422)
    conv.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
    return conv
  },
  conversations: async function(args, req) {
    //returns all conversations for a single user 
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conversations = await Conversation.findManyConversationsForOneUser(req.userId)
    if(conversations.length === 0) return []
    conversations.forEach(conv => {
      conv._id = conv._id.toString()
      conv.participants.forEach(p => p._id = p._id.toString())
      conv.messages.forEach(m => {
        m.from = m.from.toString()
        m.to = m.toString()
        m.writtenAt = m.writtenAt.toISOString()
      })
    })
    return conversations
  },
  //for lists that contains follower type objects
  getList: async function({listname}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(!user[listname]) throwAnError('Requested list not found', 404)
    if(user[listname].length === 0) return []
    return user[listname]
  },
  //mutations
  acceptEmail: async function({token}, req) {
    const user = await User.findUser({ password: token})
    if(!user) throwAnError('User not found or already has been approved', 404)
    if(user.approved) return false
    else if(token === user.password && !user.approved) {
      User.updateUser(user._id.toString(), { $set: { approved: true } })
      return true
    } else return false
  },
  requestPasswordReset: async function({email}, req){
    const user = await User.findUser({email: email})
    if(!user) throwAnError('User not found', 404)
    if(user.resetPassword) {
      if(user.resetPassword.bestBefore > new Date()) return true
      else await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" }})
    }
    const token = await randomBytes(20)
    await User.setResetPasswordToken(user._id.toString(), token.toString('hex'))
    return true
  },
  setNewPassword: async function({token, newPassword}, req) { 
    const user = await User.findUser({ "resetPassword.token" : token })
    if(!user) throwAnError('user not found', 404)
    //add resend email
    if(user.resetPassword.bestBefore < new Date()) {
      await User.updateUser(user._id.toString(), { $unset: { resetPassword : "" } })
      const token = await randomBytes(20)
     await User.setResetPasswordToken(user._id.toString(), token.toString('hex'))
      return false
    }
    const hashedPw = await bycrypt.hash(newPassword, 16)
    await User.updateUser(user._id.toString(), { $set : { password : hashedPw }, $unset: { resetPassword : "" } })
    return true
  },
  createUser: async function({userInput}, req) {
    //reminder to add twilio and sendgrid
    try {
      const hashedPw = await bycrypt.hash(userInput.password, 16)
      userInput.password = hashedPw
      const newUser = new User(userInput)
      await newUser.save()
      return true
    } catch {
      return false
    }
  },
  updateUser: async function({userInput}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    try {
      if(userInput.password) userInput.password = await bycrypt.hash(userInput.password, 16)
      await User.updateUser(req.userId, { $set: userInput})
      return true
    } catch {
      return false
    }
  },
  deleteUser: async function(req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    try {
      await User.deleteUser(req.userId)
      return true
    } catch {
      return false
    }
  },
  verifyPassword: async function({password}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    return await bycrypt.compare(password, user.password)
  },
  createTodo: async function({todoInput}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User does not exist', 404)
    const todo = new Todo({ 
      ...todoInput, 
      creatorId: req.userId
    })
    await todo.save()
    if(todo.completed) await User.updateUser(req.userId, { $set : { FullfilledTodos: user.FullfilledTodos + 1}})
    else await User.updateUser(req.userId, { $set : { ActiveTodos: user.ActiveTodos + 1}})
    return {
      ...todo, 
      createdAt: todo.createdAt.toISOString()
    }
  },
  updateTodo: async function({todoInput, todoId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(todo.creatorId !== req.userId) throwAnError('Action is not allowed', 400)
    await Todo.updateTodo(todoId, { $set: todoInput })
    return {
      ...todo,
      task: todoInput.task || todo.task,
      completed: todoInput.completed || todo.completed,
      createdAt: todo.createdAt.toISOString(),
      timeToComplete: todoInput.timeToComplete || todo.timeToComplete,
      public: todoInput.public || todo.public
    }
  },
  deleteTodo: async function({todoId}, req){
    try {
      if(!req.userId) throwAnError('Authorization failed', 400)
      const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
      if(!user) throwAnError('User not found', 404)
      const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
      if(todo.creatorId !== req.userId) return false
      await Todo.deleteTodo(todoId)
      return true
    } catch {
      return false
    }
  },
  sendFollowRequest: async function({to}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === to) return false
    const requestSender = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!requestSender) throwAnError('Sender does not exist', 404)
    const requestReceiver = await User.findUser({ _id: new mongo.ObjectID(to)})
    if(!requestReceiver) throwAnError('Receiver does not exist', 404)
    if(
      requestReceiver.followers.some(f => f._id === req.userId) ||
      requestSender.following.some(f => f._id === to) ||
      requestReceiver.blacklist.some(f => f._id === req.userId) ||
      requestSender.blacklist.some(f => f._id === to)
    ) return false
    if(!requestReceiver.requestsFrom.some(r => r._id === req.userId))
      await User.pushSomething(to, 'requestsFrom', User.formatUserAsFollower(requestSender))
    if(!requestSender.requestsTo.some(r => r._id === to))
      await User.pushSomething(req.userId, 'requestsTo', User.formatUserAsFollower(requestReceiver))
    return true
  },
  unsendFollowRequest: async function({to}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === to) return false
    const requestSender = await User.findUser({_id: new mongo.ObjectID(req.userId)})
    if(!requestSender) throwAnError('Sender does not exist', 404)
    const requestReceiver = await User.findUser({_id: new mongo.ObjectID(to)})
    if(!requestReceiver) throwAnError('Receiver does not exist', 404)
    await User.pullSomething(req.userId, 'requestsTo', { _id: to })
    await User.pullSomething(to, 'requestsFrom', { _id: req.userId })
    return true
  },
  rejectFollowRequest: async function({from}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === from) return false
    const requestReceiver = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!requestReceiver) throwAnError('Request receiver not found', 404)
    const requestSender = await User.findUser({ _id: new mongo.ObjectID(from)})
    if(!requestSender) throwAnError('Request sender not found', 404)
    if(
      !requestReceiver.requestsFrom.some(r => r._id === from) &&
      !requestSender.requestsTo.some(r => r._id === req.userId)
    ) return false
    await User.pullSomething(req.userId, 'requestsFrom', { _id: from })
    await User.pullSomething(from, 'requestsTo', { _id: req.userId })
    return true
  },
  acceptFollower: async function({followerId}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(followerId === req.userId) return false
    const newFollower = await User.findUser({ _id: new mongo.ObjectID(followerId)})
    if(!newFollower) throwAnError('follower not found', 404)
    const userWhoGetsNewFollower = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!userWhoGetsNewFollower) throwAnError('User not found', 404)
    if(
      !userWhoGetsNewFollower.requestsFrom.some(r => r._id === followerId) ||
      !newFollower.requestsTo.some(r => r._id === req.userId)
    ) return false

    const newFollowerInFollowers = userWhoGetsNewFollower.followers.some(f => f._id === followerId)
    //checks whether user who send a following request is already in followers list
    if(newFollowerInFollowers) {
      await User.pullSomething(req.userId, 'requestsFrom', { _id: followerId })
      await User.pushSomething(req.userId, 'followers', User.formatUserAsFollower(newFollower))
    }
    const ifUserInFollowing = newFollower.following.some(f => f._id === req.userId)
    //Checks whether user who send a request already has a user in following list
    if(ifUserInFollowing){
      await User.pullSomething(followerId, 'requestsTo', { _id: req.userId })
      await User.pushSomething(followerId, 'following', User.formatUserAsFollower(userWhoGetsNewFollower))
    }
    return true
  },
  unfollow: async function({userId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === userId) return false
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    const userToUnfollow = await User.findUser({ _id: new mongo.ObjectID(userId) })
    if(!userToUnfollow) throwAnError('User not found', 404)
    if(
      !user.following.some(f => f._id === userId) &&
      !userToUnfollow.followers.some(f => f._id === req.userId) 
    ) return false
    await User.pullSomething(req.userId, 'following', {
      _id : userId
    })
    await User.pullSomething(userId, 'followers', {
      _id: req.userId
    })
    return true
  },
  blockUser: async function({userId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === userId) return false
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId) })
    if(!user) throwAnError('User not found', 404)
    const userToBlock = await User.findUser({ _id: new mongo.ObjectID(userId)})
    if(!userToBlock) throwAnError('User you want to block not found', 404)
    if(user.blacklist.some(u => u._id === userId)) return false
    await User.pullSomething(req.userId, 'requestsTo', { _id: userId })
    await User.pullSomething(req.userId, 'requestsFrom', { _id: userId })
    await User.pullSomething(req.userId, 'following', { _id: userId })
    await User.pullSomething(req.userId, 'followers', { _id: userId })
    await User.pullSomething(userId, 'requestsTo', { _id: req.userId })
    await User.pullSomething(userId, 'requestsFrom', { _id: req.userId })
    await User.pullSomething(userId, 'following', { _id: req.userId })
    await User.pullSomething(userId, 'followers', { _id: req.userId })

    await User.pushSomething(req.userId, 'blacklist', User.formatUserAsFollower(userToBlock))
    return true
  },
  unblockUser: async function({userId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    if(req.userId === userId) return false
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId) })
    if(!user) throwAnError('User not found', 404)
    if(!user.blacklist.some(u => u._id === userId)) return false
    const userToUnblock = await User.findUser({ _id: new mongo.ObjectID(userId) })
    if(!userToUnblock) throwAnError('User to unblock is not found', 404)
    await User.pullSomething(req.userId, 'blacklist', { _id: userId })
    return true
  },
  //ps dont forget to improve conversation searchers
  createConversation: async function({receiver, message}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    const user_receiver = await User.findUser({ _id: new mongo.ObjectID(receiver) })
    if(!user_receiver) throwAnError('Receiver does not exist')
    //test this
    if(
      user_receiver.blacklist.some(u => u._id === req.userId) ||
      (!user_receiver.public && !user_receiver.following.some(u => u._id === req.userId))
    ) throwAnError('Cannot contact that user', 422)
    const convAlreadyExists = await Conversation.findDialogue(req.userId, receiver)
    if(convAlreadyExists) throwAnError('Conversation already exists', 400)
    const messageId = (await randomBytes(12)).toString('hex')
    const conversation = new Conversation({
      participants: [User.formatUserAsFollower(user), User.formatUserAsFollower(user_receiver)],
      messages: [
        {
          id: messageId, 
          from: req.userId, 
          to: receiver, 
          text: message, 
          writtenAt: new Date()
        }
      ]
    })
    await conversation.save()
    conversation.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
    return {
      ...conversation
    }
  },
  writeMessage: async function({to, text, convId}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.userId)) return false
    const messageId = (await randomBytes(12)).toString('hex')
    await Conversation.addMassage(convId, {
      id: messageId,
      from: req.userId,
      to: to,
      text: text,
      writtenAt: new Date()
    })
    return true
  },
  deleteMessage: async function({messageId, conversationId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(conversationId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.userId)) return false
    let message = conversation.messages.find(m => m.id === messageId)
    if(!message) return false
    if(message.from !== req.userId) return false
    await Conversation.deleteMessageForAll(conversationId, message.id)
    return true
  }
}