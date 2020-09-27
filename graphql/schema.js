const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    _id: ID!
    creator: Follower! 
    task: String!
    completed: Boolean!
    createdAt: String!
    timeToComlete: Int!
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
    email: String
    followers: [Follower]
    following: [Follower]
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
    messages: [Message!]!
  }

  type Message {
    id: ID!
    from: ID!
    to: ID!
    text: String!
    writtenAt: String!
  }

  type FullUser {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    followers: [Follower]!
    following: [Follower]!
    FulfilledTodos: Int!
    ActiveTodos: Int!
    requestsTo: [Follower]!
    requestsFrom: [Follower]!
    phone: String
    createdAt: String!
    dialogues: [Conversation]!
    website: String
    company: String
    about: String
    relationshipStatus: String
    public: Boolean!
  }

  type AuthData {
    token: String!
    userId: ID!
    username: String!
  } 

  input CreateUserInputData {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    public: Boolean!
    phone: String
    password: String!
    website: String
    company: String
    about: String
    relationshipStatus: String
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
    todos(userId: ID) : [Todo]!
    todo(todoId: ID!): Todo!
    user(userId: ID): User!
    findUser(username: String!) : Follower!
    followingOrFollowers(userId: ID, field: String!): [Follower]!
    conversation(convId: ID!) : Conversation!
    conversations: [Conversation]!
    getList(listname: String!) : [Follower]!
  }

  type RootMutation {
    acceptEmail(token: ID!) : Boolean!
    requestPasswordReset(email: String!) : Boolean!
    setNewPassword(token: String!, newPassword: String!) : Boolean!
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: UpdateUserInputData) : Boolean!
    deleteUser: Boolean!
    verifyPassword(password: String!) : Boolean!
    createTodo(todoInput: CreateTodoInputData) : Boolean!
    updateTodo(todoInput: UpdateTodoInputData, todoId: ID!) : Boolean!
    deleteTodo(todoId: ID!) : Boolean!
    sendFollowRequest(to: ID!) : Boolean!
    unsendFollowRequest(to: ID!) : Boolean!
    rejectFollowRequest(from: ID!) : Boolean
    acceptFollower(followerId: ID!) : Boolean!
    unfollow(userId: ID!) : Boolean!
    blockUser(userId: ID!) : Boolean!
    unblockUser(userId: ID!) : Boolean!
    isAbleToContact(userId: ID!) : Boolean!
    createConversation(receiver: ID!, message: String!) : Conversation!
    writeMessage(to: ID!, text: String!, convId: ID!) : Boolean!
    deleteMessage(messageId: ID!, conversationId: ID!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)