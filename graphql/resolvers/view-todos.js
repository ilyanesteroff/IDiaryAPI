const {Todo} = require('../../js/models/Todo')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const checkUsersCompatibility = require('./if-user-able-contact')


module.exports = async function(userId, page, user) {
  try{
    !user && throwAnError('Authorization failed', 400)
    let todos 
    if(user._id === userId || !userId) todos = await Todo.findManyTodos({ "creator._id" : user._id }, page, 20)
    else {
      const verdict = await checkUsersCompatibility(user, userId)
      verdict
        ? todos = await Todo.findManyTodos({ "creator._id" : user._id }, page, 20)
        : throwAnError('You are not allowed doing this', 400)
    }

    todos.forEach(t => {
      t._id = t._id.toString()
      t.createdAt = t.createdAt.toISOString()
      if(t.updatedAt) t.updatedAt = t.updatedAt.toISOString()
    })

    return todos
  } catch(err){
    checkAndThrowError(err)
  } 
}