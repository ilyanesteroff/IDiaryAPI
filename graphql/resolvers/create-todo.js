const { ObjectID } = require('mongodb')
const { Todo } = require('../../js/models/Todo')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(todoInput, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    
    const clientPublic = await UserSettings.getSpecificFields({ _id: new ObjectID(client._id) }, { _id : 0, public: 1 })
    const todo = new Todo({ 
      ...todoInput, 
      creator: {
        _id: client._id,
        username: client.username,
        public: clientPublic.public
      }
    })
    const savedTodo = await todo.save()

    if(savedTodo.completed) await UserInfo.increaseCompletedTodos(client._id)
    else await UserInfo.increaseActiveTodos(client._id)
    return {
      ...savedTodo,
      createdAt: savedTodo.createdAt.toISOString(),
      _id: savedTodo._id.toString()
    }
  } catch(err) { 
    checkAndThrowError(err)
  } 
}