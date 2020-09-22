const crypto = require('crypto')
const { promisify } = require('util')
const mongo = require('mongodb')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const {secrets} = require('../utils/variables')
const {throwAnError} = require('../utils/error-handlers')

module.exports = {
  getAuthUser: async function(req){
    
  },
  checkEmailAndUsername: async function({email, username}){
    const user = await User.findUser({$or: [{email: email}, {username: username}]})
    return !user
      ? false
      : true
  },
  getResetPassword: async function({token}, req) {
  
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
  todos: async function(opts, req) {
    const user = await User.getSpecificField(req.userId, 'Todos')
    if(!user) throwAnError('User not found', 404)
    return user.Todos
  },
  todo: async function({todoId}, req) {
    
  },
  user: async function({userId}, req){

  },
  findUser: async function({username}, req) {

  },
  followers: async function(req){
    
  },
  following: async function(req){

  },
  messages: async function(req){

  },
  requests: async function(req){

  },
  blacklist: async function(req){

  },
  acceptEmail: async function({userID}, req){

  },
  requestPasswordReset: async function({email}, req){

  },
  setNewPassword: async function({token, newPassword}, req){

  },
  createUser: async function({userInput}, req) {
    const hashedPw = await bycrypt.hash(userInput.password, 16)
    userInput.password = hashedPw
    const newUser = new User(userInput)
    await newUser.save()
    return true
  },
  updateUser: async function({userInput}, req){

  },
  deleteUser: async function(req){

  },
  createTodo: async function({todoInput}, req){
    const randomBytes = promisify(crypto.randomBytes)
    const id = await randomBytes(16)
    const todo = {
      ...todoInput,
      id: id.toString('hex'),
      createdAt: new Date()
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