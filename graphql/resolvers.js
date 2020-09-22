const mongo = require('mongodb')
const User = require('../models/User')

module.exports = {
  getAuthUser: async function(req){
    
  },
  getResetPassword: async function({token}, req) {

  },
  login: async function({email, password}, req) {
    
  },
  todos: async function(req) {

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
  setNewPassword: async function({token, newPAssword}, req){

  },
  createUser: async function({userInput}, req){

  },
  updateUser: async function({userInput}, req){

  },
  deleteUser: async function(req){

  },
  createTodo: async function({todoInput}, req){

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