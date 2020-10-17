const {User} = require('../../js/models/User')
const {Todo} = require('../../js/models/Todo')
const mongo = require('mongodb')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')

exports.createTodo = async function(todoInput, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = new Todo({ 
      ...todoInput, 
      creator: User.formatUserAsFollower(user)
    })
    const savedTodo = await todo.save()
    if(todo.completed) await User.updateUser(user._id, { $inc : { FullfilledTodos: 1}})
    else await User.updateUser(user._id, { $inc : { ActiveTodos: 1}})
    return {
      ...savedTodo.ops[0],
      createdAt: savedTodo.ops[0].createdAt.toISOString(),
      _id: savedTodo.ops[0]._id.toString()
    }
  } catch(err) { 
    checkAndThrowError(err)
  } 
}

exports.updateTodo = async function(todoInput, todoId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(todo.creator._id !== user._id) return false
    const updatedTodo =  await Todo.updateTodo(todoId, { $set: todoInput })
    if(todoInput.completed === true)
      await User.updateUser(user._id, { $inc : { FullfilledTodos: 1, ActiveTodos: -1}})
    if(todoInput.completed === false)
      await User.updateUser(user._id, { $inc : { ActiveTodos: 1, FullfilledTodos: -1}}) 
    return {
      ...updatedTodo,
      createdAt: updatedTodo.createdAt.toISOString(),
      _id: updatedTodo._id.toString()
    }
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.deleteTodo = async function(todoId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const user = req.user
    const todo = await Todo.findOneTodo({ _id: new mongo.ObjectID(todoId)})
    if(todo.creator._id !== user._id) return false
    if(todo.completed)
      await User.updateUser(user._id, { $inc : { FullfilledTodos: -1 }})
    else
      await User.updateUser(user._id, { $inc : { ActiveTodos: -1}})
    await Todo.deleteTodo(todoId)
    return true
  } catch {
    checkAndThrowError(err)
  }
}

exports.countTodosByTagname = async function(tag, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    const todoCount = await Todo.countTodos({ tags: tag })
    return todoCount
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.findTodosByTagname = async function(tag, page, req) {
  try { 
    if(!req.user) throwAnError('Authorization failed', 400)
    //make a const limit
    const todos = await Todo.findManyTodos({tags: tag,public: true}, page, 20)
    todos.forEach(t => {
      t._id = t._id.toString()
      t.createdAt = t.createdAt.toISOString()
    })
    return todos
  } catch(err) {
    checkAndThrowError(err)
  } 
}