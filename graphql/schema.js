const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    createdAt: String!
    timeToComlete: Int!
    public: Boolean!
  }
  
  type Follower {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
  }

  type User {
    BasicInfo: Follower!
    email: String!
    Todos: [Todo]!
    followers: [User]!
    following: [User]!
    FulfilledTodos: Int!
    ActiveTodos: Int!
  }

  type Message {
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
    UserInfo: User!
    messages: [Message]!
    requests: [Request]!
    phone: String
    password: String!
    createdAt: String!
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
    phone: String
    password: String!
  }

  input CreateTodoInputData {
    task: String!
    completed: Boolean!
    timeToComplete: Int!
    public: Boolean!
  }

  type RootQuery {
    getAuthUser: FullUser!
    checkEmailAndUsername(email: String!, username: String!): Boolean!
    getResetPassword(token: String!) : Boolean!
    login(email: String!, password: String!) : AuthData!
    todos : [Todo]!
    todo(todoId: String!): Todo!
    user(userId: ID!): User!
    findUser(username: String!) : User!
    followers: [User]!
    following: [User]!
    messages: [Message]!
    requests: [Request]!
    blacklist: [Follower]!
  }

  type RootMutation {
    acceptEmail(userId: ID!) : Boolean!
    requestPasswordReset(email: String!) : Boolean!
    setNewPassword(token: String!, newPassword: String!) : Boolean!
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: CreateUserInputData) : Boolean!
    deleteUser: Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: CreateTodoInputData) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
    follow(from: ID!, to: ID!) : User!
    acceptFollower(followerId: ID!) : Follower!
    unfollow(userId: ID!) : Boolean!
    blockUser(userId: ID!) : [Follower!]!
    unblockUser(userId: ID!) : [Follower!]
    contactUser(from: ID!, to: ID!, text: String!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)