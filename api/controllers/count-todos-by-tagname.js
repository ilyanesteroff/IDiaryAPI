const { Todo } = require('../../js/models/Todo')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { tag } = req.query
    if(!user) return res.status(404).json({ error: 'Authorization failed' })
    updateUserActivity(user._id)
    if(!tag || tag === '') return res.status(400).json({ error: 'Tag was not provided' })
    const todoCount = await Todo.countTodos({ tags: tag })

    return res.status(200).json({ todoCount: todoCount })
  } catch(err) {
    return res.status(500).json({ error: err.message })
  }
}