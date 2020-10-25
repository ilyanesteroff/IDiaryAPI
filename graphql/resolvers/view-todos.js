const { Todo } = require('../../js/models/Todo')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const checkUsersCompatibility = require('../../assistants/user/if-user-allowed')
const updateUserActivity = require('../../assistants/update-user-activity')

 
module.exports = async function(userId, page, client) {
  try{
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    let todos 
    if(client._id === userId || !userId) todos = await Todo.findManyTodos({ "creator._id" : client._id }, page, 20)
    else {
      const verdict = await checkUsersCompatibility(userId, client)
      verdict
        ? todos = await Todo.findManyTodos({ "creator._id" : client._id, public: true }, page, 20)
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