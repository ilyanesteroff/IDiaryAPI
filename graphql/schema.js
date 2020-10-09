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

  type Dialogue {
    _id: ID!
    participants: [Follower!]!
    latestMessage: Message!
  }

  type Message {
    id: ID!
    author: String!
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
    FullfilledTodos: Int!
    ActiveTodos: Int!
    requestsTo: [Follower]!
    requestsFrom: [Follower]!
    phone: String
    createdAt: String!
    dialogues: [Dialogue]!
    website: String
    company: String
    about: String
    relationshipStatus: String
    public: Boolean!
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
    todos(userId: ID, page: Int!) : [Todo]!
    todo(todoId: ID!): Todo!
    user(userId: ID): User!
    findUser(username: String!) : Follower!
    followingOrFollowers(userId: ID, field: String!): [Follower]!
    conversation(convId: ID!) : Conversation!
    conversations: [Dialogue]!
    getList(listname: String!) : [Follower]!
    countTodosByTagname(tag: String!) : Int!
    findTodosByTagname(tag: String!, page: Int!) : [Todo!]!
  }

  type RootMutation {
    acceptEmail(token: ID!) : AuthData!
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
    createConversation(members: [ID!]!, message: String!) : Conversation!
    writeMessage(text: String!, convId: ID!) : Boolean!
    updateMessage(text: String!, messageId: ID!, convId: ID!): Message!
    deleteMessage(messageId: ID!, convId: ID!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)