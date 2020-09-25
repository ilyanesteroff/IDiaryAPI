const crypto = require('crypto')
const { promisify } = require('util')
const mongo = require('mongodb')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const {Todo} = require('../models/Todo')
const {Conversation} = require('../models/Message')
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
    const user = await User.findUser({ _id: new mongo.ObjectID(userId || req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.public || user._id.toString() === req.userId)
      return {
        ...user, 
        createdAt: user.createdAt.toISOString()
      }
    else 
      return {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        public: user.public
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
    let userID
    userId? userID = userId : userID = req.userId
    const user = await User.findUser({ _id: new mongo.ObjectID(userID)})
    if(!user) throwAnError('User not found', 404)
    return user[field]
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
  requests: async function(args, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.requests.length === 0) return []
    return user.requests
  },
  blacklist: async function(args, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.blacklist.length === 0) return []
    return user.blacklist
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
  follow: async function({requestData}, req){

  },
  acceptFollower: async function({followerId}, req) {

  },
  unfollow: async function({userId}, req){

  },
  blockUser: async function({userId}, req){

  },
  unblockUser: async function({userID}, req){

  },
  writeAMessage: async function({from, to, text}, req) {

  },
  deleteMessage: async function({messageId, conversationId}, req){
    
  }
}
