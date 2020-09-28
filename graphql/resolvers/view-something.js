const {User} = require('../../js/models/User')
const {Todo} = require('../../js/models/Todo')
const {Conversation} = require('../../js/models/Conversation')
const mongo = require('mongodb')
const {throwAnError} = require('../../utils/error-handlers')

exports.viewUser = async function(userId, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = req.user
  if(!userId) return { ...user, createdAt: user.createdAt.toISOString() }
  else {
    if(user.blacklist.findIndex(f => f._id === userId) > -1) throwAnError('Forbidden', 400)
    const userToView = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId)}, { 
      requestsTo: 0, requestsFrom: 0, dialogues: 0, blacklist: 0, password: 0, 
    }))[0]
    if (
      !userToView.public && 
      !userToView.followers.some(f => f._id === user._id) &&
      !userToView.following.some(f => f._id === user._id)
    ) return { ...User.formatUserAsFollower(userToView), public: userToView.public }
    return { ...userToView, createdAt: userToView.createdAt.toISOString() }
  }
}

exports.viewYourProfile = async function(req){
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = req.user
  return {
    ...user,
    createdAt: user.createdAt.toISOString()
  }
}
  
exports.viewFollowersOrFollowing = async function(userId, field, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  let user
  userId === undefined
    ? user = req.user
    : user = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId)}, {followers: 1, following: 1, public: 1}))[0]
  if(!user) throwAnError('User not found', 404)
  if(userId && userId !== req.user._id && !user.public && 
    !user.following.some(f => f._id === req.user._id) && 
    !user.followers.some(f => f._id === req.user._id)
  ) throwAnError('cannot access this prop', 422)
  return user[field]
}

exports.getList = function(listname, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = req.user
  if(!user[listname]) throwAnError('Requested list not found', 404)
  if(user[listname].length === 0) return []
  return user[listname]
}

exports.viewTodo = async function(todoId, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
  if(!todo) throwAnError('Todo not found', 404)
  if(!todo.public &&  todo.creatorId !== req.user._id) throwAnError('Cannot access todo', 400)
  return {
    ...todo,
    _id: todo._id.toString(),
    createdAt: todo.createdAt.toISOString()
  }
}

exports.viewTodos = async function(userId, page, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  let todos 
  if(userId && userId !== req.user._id) {
    const user = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId)}, { public: 1, following: 1, followers: 1}))[0]
    if(!user.public && !user.following.some(f => f._id === req.userId) && !user.followers.some(f => f._id === req.user._id)) 
      throwAnError('Cannot view todos of this user', 422)
    todos = await Todo.findManyTodos({ "creator._id": userId, public : true }, page, /*limit should be a constant*/ 20)
  } else todos = await Todo.findManyTodos({ "creator._id": req.user._id }, page, /*limit should be a constant*/ 20)
  
  todos.forEach(t => {
    t._id = t._id.toString()
    t.createdAt = t.createdAt.toISOString()
  })
  return todos
}

exports.findUserByUsername = async function(username, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  const user = (await User.getSpecificFields({username: username}, {username: 1, firstname: 1, lastname: 1}))[0]
  if(!user) throwAnError('User not found', 404)
  return {
    ...user,
    _id: user._id.toString()
  }
}
//here
exports.viewConversation = async function(convId, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  const conv = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
  if(!conv) throwAnError('Conversation not found', 404)
  if(!conv.participants.some(p => p._id === req.user._id)) throwAnError('Not allowed to access this conversation', 422)
  conv.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
  return conv
}

exports.viewConversations = async function(req) {
  //returns all conversations for a single user 
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user.dialogues.length === 0) return []
  req.user.dialogues.forEach(dialogue => {
    dialogue.latestMessage.writtenAt = dialogue.latestMessage.writtenAt.toISOString()
  })
  return req.user.dialogues
}