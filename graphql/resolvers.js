const getUserData = require('./resolvers/get-full-user')
const checkEmailAndUsername = require('./resolvers/check-username-email')
const viewTodos = require('./resolvers/view-todos')
const viewUser = require('./resolvers/view-user')
const viewRequests = require('./resolvers/requests')
const findUser = require('./resolvers/find-user')
const viewFollowers = require('./resolvers/view-followers')
const viewFollowings = require('./resolvers/view-followings')
const viewMessages = require('./resolvers/messages')
const viewLikedMessages = require('./resolvers/liked-messags')
const getConversations = require('./resolvers/view-conversations')
const findTodosByTagname = require('./resolvers/find-todos-by-tagname')
const createNewUser = require('./resolvers/create-new-user')
const updateUser = require('./resolvers/update-user')
const updateUserInfo = require('./resolvers/update-user-info')
const updateUserSettings = require('./resolvers/update-user-settings')
const deleteUser = require('./resolvers/delete-user')
const createTodo = require('./resolvers/create-todo')
const updateTodo = require('./resolvers/update-todo')
const deleteTodo = require('./resolvers/delete-todo')
const blockUser = require('./resolvers/block-user')
const unblockUser = require('./resolvers/unblock-user')


module.exports = {
  getAuthUser: (args, { user }) => getUserData(user),

  checkEmailAndUsername: ({ username, email }) => checkEmailAndUsername(email, username),
  
  todos: ({ userId, page }, { user }) => viewTodos(userId, page, user),

  user: ({ userId }, { user }) => viewUser(userId, user),

  requests: ({ incoming, page }, { user }) => viewRequests(incoming, page, user),

  findUser: ({ username }, { user }) => findUser(username, user),
  
  following: ({ userId, page }, { user }) => viewFollowings(userId, page, user),
  
  followers: ({ userId, page }, { user }) => viewFollowers(userId, page, user),

  conversations: ({ page }, { user }) => getConversations(user, page),

  messages: ({ page, convId }, { user }) => viewMessages(page, convId, user),

  likedMessages: ({ page, convId }, { user }) => viewLikedMessages(page, convId, user),

  findTodosByTagname: ( { tag, page }, { user }) => findTodosByTagname(tag, page, user),
  

  
  createUser: ({ userInput }) => createNewUser(userInput),
  
  updateUser: ({ userInput }, { user }) => updateUser(userInput, user),
  
  updateUserInfo: ({ userInput }, { user }) => updateUserInfo(userInput, user),
  
  updateUserSettings: ({ userInput }, { user }) => updateUserSettings(userInput, user),

  deleteUser: (args, { user }) => deleteUser(user),
    
  createTodo: ({ todoInput }, { user }) => createTodo(todoInput, user),

  updateTodo: ({ todoInput, todoId }, { user }) => updateTodo(todoInput, todoId, user),
  
  deleteTodo: ({ todoId }, { user }) => deleteTodo(todoId, user),
  
  blockUser: ({ userId, reason }, { user }) => blockUser(userId, reason, user),

  unblockUser: ({ username }, { user }) => unblockUser(username, user)
}