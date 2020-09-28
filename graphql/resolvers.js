const userManips = require('./resolvers/user-manipuations')
const authResolvers = require('./resolvers/auth-stuff')
const pwReset = require('./resolvers/password-reset')
const views = require('./resolvers/view-something')
const todoManips = require('./resolvers/todo-manipulations')
const FandR = require('./resolvers/following-requesting')
const security = require('./resolvers/security-stuff')
const convResolvers = require('./resolvers/conversation-stuff')

module.exports = {
  getAuthUser: (args, req) => views.viewYourProfile(req),

  checkEmailAndUsername: ({username, email}) => userManips.checkUsernameAndEmail(email, username),
  //checks whether password reset is still actual
  getResetPassword: ({token}) => pwReset.getResetPassword(token),

  login: ({email, password}) => authResolvers.login(email, password),

  todos: ({userId, page}, req) => views.viewTodos(userId, page, req),

  todo: ({todoId}, req) => views.viewTodo(todoId, req),

  user: ({userId}, req) => views.viewUser(userId, req),
  //returns a user when searching for users
  findUser: ({username}, req) => views.findUserByUsername(username, req),
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
  createConversation: ({receiver, message}, req) => convResolvers.createConversation(receiver, message, req),

  writeMessage: ({to, text, convId}, req) => convResolvers.writeMessage(to, text, convId, req),

  deleteMessage: ({messageId, conversationId}, req) => convResolvers.deleteMessage(messageId, conversationId, req)
}