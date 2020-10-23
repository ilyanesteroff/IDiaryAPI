const { Todo } = require('../../js/models/Todo')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(tag, page, client) {
  try { 
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const todos = await Todo.findManyTodos({
      tags: tag, 
      public: true, 
      "author.public" : true 
    }, page, 20)
    todos.forEach(t => {
      t._id = t._id.toString()
      t.createdAt = t.createdAt.toISOString()
    })

    return todos
  } catch(err) {
    checkAndThrowError(err)
  } 
}