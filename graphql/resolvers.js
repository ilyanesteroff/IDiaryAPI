const getUserData = require('./resolvers/get-full-user')
const viewTodos = require('./resolvers/view-todos')
const viewUser = require('./resolvers/view-user')
const viewRequests = require('./resolvers/requests')
const findUser = require('./resolvers/find-user')
const viewFollowers = require('./resolvers/view-followers')
const viewFollowings = require('./resolvers/view-followings')
const viewMessages = require('./resolvers/messages')
const viewBlockedUsers = require('./resolvers/get-blocked-users')
const getUserStats = require('./resolvers/get-user-stats')
const getConversations = require('./resolvers/view-conversations')
const getConversation = require('./resolvers/get-conversation')
const findTodosByTagname = require('./resolvers/find-todos-by-tagname')
const createNewUser = require('./resolvers/create-new-user')
const updateUser = require('./resolvers/update-user')
const updateUserInfo = require('./resolvers/update-user-info')
const updateUserSettings = require('./resolvers/update-user-settings')
const deleteUser = require('./resolvers/delete-user')
const createTodo = require('./resolvers/create-todo')
const updateTodo = require('./resolvers/update-todo')
const deleteTodo = require('./resolvers/delete-todo')


module.exports = {
  getAuthUser: (args, { user }) => getUserData(user),
  
  todos: ({ userId, page }, { user }) => viewTodos(userId, page, user),

  user: ({ userId }, { user }) => viewUser(userId, user),

  requests: ({ incoming, page }, { user }) => viewRequests(incoming, page, user),

  findUser: ({ username }, { user }) => findUser(username, user),
  
  following: ({ userId, page }, { user }) => viewFollowings(userId, page, user),
  
  followers: ({ userId, page }, { user }) => viewFollowers(userId, page, user),

  blockedUsers: ({ page }, { user }) => viewBlockedUsers(page, user),

  conversations: ({ page }, { user }) => getConversations(user, page),

  conversation:({ userId }, { user }) => getConversation(userId, user),

  messages: ({ page, convId }, { user }) => viewMessages(page, convId, user),

  userStats: (args, { user }) => getUserStats(user),

  findTodosByTagname: ( { tag, page }, { user }) => findTodosByTagname(tag, page, user),
  

  
  createUser: ({ userInput }) => createNewUser(userInput),
  
  updateUser: ({ userInput }, { user }) => updateUser(userInput, user),
  
  updateUserInfo: ({ userInput }, { user }) => updateUserInfo(userInput, user),
  
  updateUserSettings: ({ userInput }, { user }) => updateUserSettings(userInput, user),

  deleteUser: (args, { user }) => deleteUser(user),
    
  createTodo: ({ todoInput }, { user }) => createTodo(todoInput, user),

  updateTodo: ({ todoInput, todoId }, { user }) => updateTodo(todoInput, todoId, user),
  
  deleteTodo: ({ todoId }, { user }) => deleteTodo(todoId, user)
}