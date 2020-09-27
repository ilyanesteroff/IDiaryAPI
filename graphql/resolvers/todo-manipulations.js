const {User} = require('../../js/models/User')
const {Todo} = require('../../js/models/Todo')
const mongo = require('mongodb')
const {throwAnError} = require('../../utils/error-handlers')

exports.createTodo = async function(todoInput, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = new Todo({ 
      ...todoInput, 
      creator: User.formatUserAsFollower(user)
    })
    await todo.save()
    if(todo.completed) await User.updateUser(user._id, { $set : { FullfilledTodos: user.FullfilledTodos + 1}})
    else await User.updateUser(user._id, { $set : { ActiveTodos: user.ActiveTodos + 1}})
    return true
  } catch {
    return false
  } 
}

exports.updateTodo = async function(todoInput, todoId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(todo.creator._id !== user._id) return false
    await Todo.updateTodo(todoId, { $set: todoInput })
    if(todoInput.completed === true)
      await User.updateUser(user._id, { $set : { FullfilledTodos: user.FullfilledTodos + 1, ActiveTodos: user.ActiveTodos - 1}})
    if(todoInput.completed === false)
      await User.updateUser(user._id, { $set : { ActiveTodos: user.ActiveTodos + 1, FullfilledTodos: user.FullfilledTodos - 1}})
    return true
  } catch {
    return false
  }
}

exports.deleteTodo = async function(todoId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(todo.creator._id !== user._id) return false
    if(todo.completed)
      await User.updateUser(user._id, { $set : { FullfilledTodos: user.FullfilledTodos - 1}})
    else
      await User.updateUser(user._id, { $set : { ActiveTodos: user.ActiveTodos - 1}})
    await Todo.deleteTodo(todoId)
    return true
  } catch {
    return false
  }
}