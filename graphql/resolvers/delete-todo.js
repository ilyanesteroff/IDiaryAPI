const { ObjectID } = require('mongodb')
const { Todo } = require('../../js/models/Todo')
const { UserInfo } = require('../../js/models/UserInfo')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const updateUserActivity = require('../../assistants/update-user-activity')
const S3 = require('../../assistants/AWS/index')


module.exports = async function(todoId, client){
  try {
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const ifClientIsAuthor = await Todo.getSpecificFields({ _id: new ObjectID(todoId), "creator._id" : client._id }, { completed: 1, imageUrl: 1 })
    !ifClientIsAuthor && throwAnError('Cannot delete this todo', 400)

    if(ifClientIsAuthor.imageUrl) S3.deleteFile(ifClientIsAuthor.imageUrl)
    
    if(ifClientIsAuthor.completed)
      await UserInfo.decreaseCompletedTodos(client._id)
    else
      await UserInfo.decreaseActiveTodos(client._id)
    await Todo.deleteTodo(todoId)

    return true
  } catch {
    checkAndThrowError(err)
  }
}