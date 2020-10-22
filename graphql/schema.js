const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Todo {
    _id: ID!
    creator: Follower! 
    task: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String
    timeToComplete: Int
    public: Boolean!
    tags: [String]
  }
  
  type Follower {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
  }

  type User {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    public: Boolean!
    lastSeen: String
    createdAt: String
    email: String
    followers: Int
    following: Int
    FullfilledTodos: Int
    ActiveTodos: Int
    website: String
    company: String
    about: String
    relationshipStatus: String
  }

  type Conversation {
    _id: ID!
    participants: [Follower!]!
    latestMessage: Message!
    updatedAt: String!
  }

  type Message {
    _id: ID!
    conversationID: ID!
    author: String!
    text: String!
    writtenAt: String!
    seen: Boolean!
    liked: Boolean
  }

  type FullUser {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    followers: Int!
    following: Int!
    FullfilledTodos: Int!
    ActiveTodos: Int!
    requestsTo: Int!
    requestsFrom: Int!
    phone: String
    createdAt: String!
    Conversations: Int!
    website: String
    company: String
    about: String
    relationshipStatus: String
    public: Boolean!
  }

  type Request {
    _id: String!
    receiver: Follower!
    sender: Follower!
    sentAt: String!
  }

  type FollowingInfo {
    user: Follower!
    followingSince: String!
  }

  type AuthData {
    token: String!
    userId: ID!
    firstname: String!
  } 

  input CreateUserInputData {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    public: Boolean!
    password: String!
  }

  input UpdateUserInputData {
    username: String
    firstname: String
    lastname: String
    email: String
    public: Boolean
    phone: String
    password: String
    website: String
    company: String
    about: String
    relationshipStatus: String
  }

  input CreateTodoInputData {
    task: String!
    completed: Boolean!
    timeToComplete: Int
    public: Boolean!
    tags: [String]
  }

  input UpdateTodoInputData {
    task: String
    completed: Boolean
    timeToComplete: Int
    public: Boolean
    tags: [String]
  }

  type RootQuery {
    getAuthUser: FullUser!
    checkEmailAndUsername(email: String!, username: String!): Boolean!
    getResetPassword(token: String!) : Boolean!
    login(email: String!, password: String!) : AuthData!
    todos(userId: ID, page: Int!) : [Todo]!
    user(userId: ID): User!
    findUser(username: String!) : Follower!
    followingOrFollowers(userId: ID, field: String!): [FollowingInfo]!
    incomingRequests : [Request]!
    outcomingRequests: [Request]!
    conversations: [Conversation]!
    countTodosByTagname(tag: String!) : Int!
    findTodosByTagname(tag: String!, page: Int!) : [Todo]!
  }

  type RootMutation {
    acceptEmail(token: ID!) : AuthData!
    requestPasswordReset(email: String!) : Boolean!
    setNewPassword(token: String!, newPassword: String!) : Boolean!
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: UpdateUserInputData) : User!
    deleteUser: Boolean!
    verifyPassword(password: String!) : Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: UpdateTodoInputData, todoId: ID!) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
    sendFollowRequest(to: ID!) : Boolean!
    unsendFollowRequest(to: ID!) : Boolean!
    rejectFollowRequest(from: ID!) : Boolean
    acceptFollower(followerId: ID!) : Boolean!
    unfollow(userId: ID!) : Boolean!
    blockUser(userId: ID!) : Boolean!
    unblockUser(userId: ID!) : Boolean!
    isAbleToContact(userId: ID!) : Boolean!
    createConversation(members: [ID!]!, message: String!) : Conversation!
    writeMessage(text: String!, convId: ID!) : Message!
    updateMessage(text: String!, messageId: ID!, convId: ID!): Message!
    deleteMessage(messageId: ID!, convId: ID!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)