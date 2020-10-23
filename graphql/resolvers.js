const userManips = require('./resolvers/user-manipuations')
const authResolvers = require('./resolvers/auth-stuff')
const pwReset = require('./resolvers/password-reset')
const views = require('./resolvers/view-something')
const todoManips = require('./resolvers/todo-manipulations')
const FandR = require('./resolvers/following-requesting')
const security = require('./resolvers/security-stuff')
const convResolvers = require('./resolvers/conversation-stuff')
const getUserData = require('./resolvers/get-full-user')
const checkEmailAndUsername = require('./resolvers/check-username-email')
const viewTodos = require('./resolvers/view-todos')
const viewUser = require('./resolvers/view-user')
const findUser = require('./resolvers/find-user')
const viewFStats = require('./resolvers/view-following')
const getConversations = require('./resolvers/view-conversations')
const findTodosByTagname = require('./resolvers/find-todos-by-tagname')
const createNewUser = require('./resolvers/create-new-user')
const updateUser = require('./resolvers/update-user')
const updateUserInfo = require('./resolvers/update-user-info')
const updateUserSettings = require('./resolvers/update-user-settings')
const deleteUser = require('./resolvers/delete-user')


module.exports = {
  getAuthUser: (args, { user }) => getUserData(user),

  checkEmailAndUsername: ({ username, email }) => checkEmailAndUsername(email, username),
  
  todos: ({ userId, page }, { user }) => viewTodos(userId, page, user),

  user: ({ userId }, { user }) => viewUser(userId, user),
  //returns a user when searching for users
  findUser: ({ username }, { user }) => findUser(username, user),
  //fetching who follows users or whom user is following
  followingOrFollowers: ({ userId, field }, { user }) => viewFStats(userId, field, user),

  conversations: ({ page }, { user }) => getConversations(user, page),

  findTodosByTagname: ( { tag, page }, { user }) => findTodosByTagname(tag, page, user),
  

  
  createUser: ({ userInput }) => createNewUser(userInput),
  
  updateUser: ({ userInput }, { user }) => updateUser(userInput, user),
  
  updateUserInfo: ({ userInput }, { user }) => updateUserInfo(userInput, user),
  
  updateUserSettings: ({ userInput }, { user }) => updateUserSettings(userInput, user),

  deleteUser: (args, { user }) => deleteUser(user),
  
  verifyPassword: ({password}, req) => authResolvers.verifyPassword(password, req),
  
  createTodo: ({todoInput}, req) => todoManips.createTodo(todoInput, req),

  updateTodo: ({todoInput, todoId}, req) => todoManips.updateTodo(todoInput, todoId, req),
  
  deleteTodo: ({todoId}, req) => todoManips.deleteTodo(todoId, req),

  sendFollowRequest: ({to}, req) => FandR.sendFollowRequest(to, req),

  unsendFollowRequest: ({to}, req) => FandR.unsendFollowRequest(to, req),

  rejectFollowRequest: ({from}, req) => FandR.rejectFollowRequest(from, req),
  
  acceptFollower: ({followerId}, req) => FandR.acceptFollower(followerId, req),

  unfollow: ({userId}, req) => FandR.unfollow(userId, req),
  
  blockUser: ({userId}, req) => security.blockUser(userId, req),

  unblockUser: ({userId}, req) => security.unblockUser(userId, req),

  isAbleToContact: ({userId}, req) => security.isAbleToContact(userId, req),
  //ps dont forget to improve conversation searchers
  createConversation: ({members, message}, req) => convResolvers.createConversation(members, message, req),

  writeMessage: ({text, convId}, req) => convResolvers.writeMessage(text, convId, req),

  updateMessage: ({text, messageId, convId}, req) => convResolvers.updateMessage(text, messageId, convId, req),

  deleteMessage: ({messageId, convId}, req) => convResolvers.deleteMessage(messageId, convId, req)
}