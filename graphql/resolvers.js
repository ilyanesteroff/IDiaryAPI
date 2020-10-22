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
const ifPwResetIsActual = require('./resolvers/if-pw-reset-is-actual')
const viewTodos = require('./resolvers/view-todos')
const viewUser = require('./resolvers/view-user')
const findUser = require('./resolvers/find-user')


module.exports = {
  getAuthUser: (args, req) => getUserData(req),

  checkEmailAndUsername: ({username, email}) => checkEmailAndUsername(email, username),
  
  getResetPassword: ({token}) => ifPwResetIsActual(token),

  login: ({email, password}) => authResolvers.login(email, password),

  todos: ({userId, page}, {user}) => viewTodos(userId, page, user),

  user: ({userId}, {user}) => viewUser(userId, user),
  //returns a user when searching for users
  findUser: ({username}, {user}) => findUser(username, user),
  //fetching who follows users or whom user is following
  followingOrFollowers: ({userId, field}, req) => views.viewFollowersOrFollowing(userId, field, req),

  conversation: ({convId}, req) => views.viewConversation(convId, req),

  conversations: (args, req) => views.viewConversations(req),
  //for lists that contains follower type objects
  getList: ({listname}, req) => views.getList(listname, req),

  countTodosByTagname: ({tag}, req) => todoManips.countTodosByTagname(tag, req),

  findTodosByTagname: ({tag, page}, req) => todoManips.findTodosByTagname(tag, page, req),
  //mutations
  acceptEmail: ({token}) => authResolvers.acceptEmail(token),

  requestPasswordReset: ({email}, req) => pwReset.requestPasswordReset(email, req),
  
  setNewPassword: ({token, newPassword}, req) => pwReset.setNewPassword(token, newPassword, req),
  
  createUser: ({userInput}, req) => userManips.createUser(userInput, req),
  
  updateUser: ({userInput}, req) => userManips.updateUser(userInput, req),
  
  deleteUser: (args, req) => userManips.deleteUser(req),
  
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