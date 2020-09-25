const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    _id: ID!
    creatorId: ID!
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
    email: String!
    followers: [Follower]!
    following: [Follower]!
    FulfilledTodos: Int!
    ActiveTodos: Int!
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
    seen: Boolean!
  }

  type Request {
    from: ID!
    to: ID!
    accepted: Boolean!
  }

  type FullUser {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    conversations: [Conversation]!
    followers: [Follower]!
    following: [Follower]!
    FulfilledTodos: Int!
    ActiveTodos: Int!
    requests: [Request]!
    phone: String
    createdAt: String!
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
  }

  input CreateTodoInputData {
    task: String!
    completed: Boolean!
    timeToComplete: Int!
    public: Boolean!
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
    conversations: [Conversation]!
    requests: [Request]!
    blacklist: [Follower]!
  }

  type RootMutation {
    acceptEmail(token: ID!) : Boolean!
    requestPasswordReset(email: String!) : Boolean!
    setNewPassword(token: String!, newPassword: String!) : Boolean!
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: CreateUserInputData) : Boolean!
    deleteUser: Boolean!
    verifyPassword(password: String!) : Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: CreateTodoInputData, todoId: ID!) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
    follow(from: ID!, to: ID!) : User!
    acceptFollower(followerId: ID!) : Follower!
    unfollow(userId: ID!) : Boolean!
    blockUser(userId: ID!) : [Follower!]!
    unblockUser(userId: ID!) : [Follower!]
    contactUser(from: ID!, to: ID!, text: String!) : Conversation!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)