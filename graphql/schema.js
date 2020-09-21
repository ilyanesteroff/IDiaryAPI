const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    createdAt: String!
    timeToComlete: Int!
    overdued: Boolean!
  }

  type User {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    Todos: [Todo]!
    followers: [User]!
    FulfilledTodos: Int!
    FailedTodos: Int!
  }

  type FullUser {
    UserInfo: User!
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
    login(email: String!, password: String!) : AuthData!
    todos : [Todo]!
    todo(todoId: String!): Todo!
    user(userId: ID!): User!
    followers: [User]!
    following: [User]!
  }

  type RootMutation {
    createUser(userInput: CreateUserInputData) : FullUser!
    updateUser(userInput: CreateUserInputData) : FullUser!
    deleteUser: Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: CreateTodoInputData) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
    follow(userId: ID!) : User!
    unfollow(userId: ID!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)