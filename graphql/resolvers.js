const crypto = require('crypto')
const { promisify } = require('util')
const mongo = require('mongodb')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const {secrets} = require('../utils/variables')
const {throwAnError} = require('../utils/error-handlers')

const randomBytes = promisify(crypto.randomBytes)

module.exports = {
  getAuthUser: async function(args, req){
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
  getResetPassword: async function({token}, req) {
    const user = await User.findUser({ resetPassword : { token: token} })
    if(!user) throwAnError('User not found', 404)
    if(user.resetPassword.bestBefore < new Date()) {
      User.updateUser(req.userId, { $unset: resetPassword })
      return false
    }
    return true 
  },
  login: async function({email, password}, req) {
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
  todos: async function(args, req) {
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.Todos.length < 1) throwAnError('User has no todos', 422)
    return user.Todos
  },
  todo: async function({todoId, userId}, req) {
    let userID
    userId? userID = userId : userID = req.userId
    const user = await User.findUser({ _id: new mongo.ObjectID(userID)})
    if(!user) throwAnError('User not found', 404)
    const todoIndex = user.Todos.findIndex(t => t.id === todoId)
    if(todoIndex < 0) throwAnError('Todo not found', 404)
    return {
      ...user.Todos[todoIndex],
      createdAt: user.Todos[todoIndex].createdAt.toISOString()
    }
  },
  user: async function({userId}, req){
    let userID
    userId? userID = userId : userID = req.userId
    const user = await User.findUser({ _id: new mongo.ObjectID(userID)})
    if(!user) throwAnError('User not found', 404)
    return {
      ...user, 
      createdAt: user.createdAt.toISOString()
    }
  },
  //returns a user when searching for users
  findUser: async function({username}, req) {
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
  messages: async function(args, req) {
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.messages.length === 0) throwAnError('User has no messages', 422)
    return user.messages
  },
  requests: async function(args, req){
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.requests.length === 0) throwAnError('User has no requests', 422)
    return user.requests
  },
  blacklist: async function(args, req){
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    if(user.blacklist.length === 0) throwAnError('Blacklist is empty', 422)
    return user.blacklist
  },
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
    try {
      const hashedPw = await bycrypt.hash(userInput.password, 16)
      userInput.password = hashedPw
      await User.updateUser(req.userId, { $set: userInput})
      return true
    } catch {
      return false
    }
  },
  deleteUser: async function(req){
    try {
      await User.deleteUser(req.userId)
      return true
    } catch {
      return false
    }
  },
  verifyPassword: async function({password}, req){
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    const matches = await bycrypt.compare(password, user.password)
    return matches
  },
  createTodo: async function({todoInput}, req){
    const id = await randomBytes(16)
    const todo = {
      ...todoInput,
      id: id.toString('hex'),
      createdAt: new Date().toISOString()
    }
    const updatedUser = await User.pushSomething(req.userId, 'Todos', todo)
    return { 
      ...todo, 
      createdAt: todo.createdAt.toString()
    }
  },
  updateTodo: async function({todoInput}, req){

  },
  deleteTodo: async function({todoId}, req){
    
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
  contactUser: async function({message}, req) {

  }
}