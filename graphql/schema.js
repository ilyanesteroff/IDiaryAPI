const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    createdAt: String!
    timeToComlete: Int!
    overdued: Boolean!
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
    FailedTodos: Int!
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
    timeToComplete: String!
  }

  type RootQuery {
    getAuthUser: FullUser!
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
    createUser(userInput: CreateUserInputData) : FullUser!
    updateUser(userInput: CreateUserInputData) : FullUser!
    deleteUser: Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: CreateTodoInputData) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
    follow(requestData: Request!) : User!
    acceptFollower(followerId: ID!) : Follower!
    unfollow(userId: ID!) : Boolean!
    blockUser(userId: ID!) : [Follower!]!
    unblockUser(userId: ID!) : [Follower!]
    contactUser(message: Message!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)