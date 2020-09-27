const mongo = require('mongodb')
const userManips = require('./resolvers/user-manipuations')
const authResolvers = require('./resolvers/auth-stuff')
const pwReset = require('./resolvers/password-reset')
const views = require('./resolvers/view-something')
const todoManips = require('./resolvers/todo-manipulations')
const FandR = require('./resolvers/following-requesting')
const security = require('./resolvers/security-stuff')
const {User} = require('../js/models/User')
const {Conversation} = require('../js/models/Conversation')

module.exports = {
  getAuthUser: (args, req) => views.viewYourProfile(req),

  checkEmailAndUsername: ({username, email}) => userManips.checkUsernameAndEmail(email, username),
  //checks whether password reset is still actual
  getResetPassword: ({token}) => pwReset.getResetPassword(token),

  login: ({email, password}) => authResolvers.login(email, password),

  todos: ({userId}, req) => views.viewTodos(userId, req),

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
  createConversation: async function({receiver, message}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const user = await User.findUser({ _id: new mongo.ObjectID(req.userId)})
    if(!user) throwAnError('User not found', 404)
    const user_receiver = await User.findUser({ _id: new mongo.ObjectID(receiver) })
    if(!user_receiver) throwAnError('Receiver does not exist')
    //test this
    if(
      user_receiver.blacklist.some(u => u._id === req.userId) ||
      (!user_receiver.public && !user_receiver.following.some(u => u._id === req.userId))
    ) throwAnError('Cannot contact that user', 422)
    const convAlreadyExists = await Conversation.findDialogue(req.userId, receiver)
    if(convAlreadyExists) throwAnError('Conversation already exists', 400)
    const messageId = (await randomBytes(12)).toString('hex')
    const conversation = new Conversation({
      participants: [User.formatUserAsFollower(user), User.formatUserAsFollower(user_receiver)],
      messages: [
        {
          id: messageId, 
          from: req.userId, 
          to: receiver, 
          text: message, 
          writtenAt: new Date()
        }
      ]
    })
    await conversation.save()
    conversation.messages.forEach(m => m.writtenAt = m.writtenAt.toISOString())
    return {
      ...conversation
    }
  },
  writeMessage: async function({to, text, convId}, req) {
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(convId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.userId)) return false
    const messageId = (await randomBytes(12)).toString('hex')
    await Conversation.addMassage(convId, {
      id: messageId,
      from: req.userId,
      to: to,
      text: text,
      writtenAt: new Date()
    })
    return true
  },
  deleteMessage: async function({messageId, conversationId}, req){
    if(!req.userId) throwAnError('Authorization failed', 400)
    const conversation = await Conversation.findConversation({ _id: new mongo.ObjectID(conversationId)})
    if(!conversation) throwAnError('Conversation not found', 404)
    if(!conversation.participants.some(p => p._id === req.userId)) return false
    let message = conversation.messages.find(m => m.id === messageId)
    if(!message) return false
    if(message.from !== req.userId) return false
    await Conversation.deleteMessageForAll(conversationId, message.id)
    return true
  }
}