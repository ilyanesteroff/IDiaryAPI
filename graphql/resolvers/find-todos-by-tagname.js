const { Todo } = require('../../js/models/Todo')
const someoneBlocked = require('../../assistants/user/if-users-blocked')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(tag, page, client) {
  try { 
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const todos = await Todo.findManyTodos({
      tags: tag, 
      public: true, 
      "creator.public" : true 
    }, page, parseInt(process.env.ITEMS_PER_PAGE) / 2)

    const output = []

    for await (let todo of todos){
      const ifBlocked = await someoneBlocked(todo.creator._id, client._id)
      if(!ifBlocked){
        todo._id = todo._id.toString()
        todo.createdAt = todo.createdAt.toISOString()
        output.push(todo)
      }
    }

    return output
  } catch(err) {
    checkAndThrowError(err)
  } 
}