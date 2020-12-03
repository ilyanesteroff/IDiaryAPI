const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Todo {
    _id: ID!
    creator: TodoAuthor! 
    task: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String
    timeToComplete: Int
    public: Boolean!
    imageUrl: String
    tags: [String]
  }

  type TodoAuthor {
    _id: ID!
    username: String!
    public: Boolean!
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
    lastSeen: String!
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
    unseenMessages: Int!
  }

  type ConversationWithMessages {
    conversation: Conversation
    messages: [Message]
    exists: Boolean
    ifUserAllowed: Boolean!
  }

  type Message {
    _id: ID!
    conversationID: ID!
    author: String!
    text: String!
    writtenAt: String!
    seen: Boolean!
    liked: Boolean
    to: ID!
  }

  type FullUser {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    followers: Int!
    following: Int!
    blockedUsers: Int!
    FullfilledTodos: Int!
    ActiveTodos: Int!
    requestsTo: Int!
    requestsFrom: Int!
    phone: String
    createdAt: String!
    conversations: Int!
    website: String
    company: String
    about: String
    relationshipStatus: String
    public: Boolean!
  }

  type UpdatedUser {
    username: String
    firstname: String
    lastname: String 
  }

  type UpdatedUserInfo {
    website: String
    company: String
    about: String
    relationshipStatus: String
  }

  type UpdatedUserSettings {
    public: Boolean
    phone: String
  }

  type Request {
    _id: String!
    receiver: Follower!
    sender: Follower!
    sentAt: String!
  }

  type BlockedUser {
    _id: ID!
    user: Follower!
    userWhoBlocked: ID!
  }

  type FollowingInfo {
    _id: String!
    user: Follower!
    followingSince: String!
  }

  type UserStats {
    incomingRequests: Int!
    unseenMessages: Int!
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
    password: String
  }

  input UpdateUserInfoData {
    website: String
    company: String
    about: String
    relationshipStatus: String
  }

  input UpdatedUserSettingsData{
    public: Boolean
    phone: String
  }

  input CreateTodoInputData {
    task: String! 
    completed: Boolean!
    timeToComplete: Int
    imageUrl: String
    public: Boolean!
    tags: [String]
  }

  input UpdateTodoInputData {
    task: String
    completed: Boolean
    timeToComplete: Int
    public: Boolean
    imageUrl: String
    tags: [String]
  }

  type RootQuery {
    getAuthUser: FullUser!
    todos(userId: ID, page: Int!) : [Todo]!
    user(username: String!): User!
    requests(incoming: Boolean!, page: Int!) : [Request]!
    findUsers(username: String!, page: Int!) : [Follower]!
    following(userId: ID!, page: Int!): [FollowingInfo]!
    followers(userId: ID!, page: Int!): [FollowingInfo]!
    blockedUsers(page: Int!): [BlockedUser]!
    conversations(page: Int!): [Conversation]!
    conversation(username: String!): ConversationWithMessages!
    messages(page: Int!, convId: ID!): [Message]!
    userStats: UserStats!
    findTodosByTagname(tag: String!, page: Int!) : [Todo]!
  }

  type RootMutation {
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: UpdateUserInputData) : UpdatedUser!
    updateUserInfo(userInput: UpdateUserInfoData) : UpdatedUserInfo!
    updateUserSettings(userInput: UpdatedUserSettingsData) : UpdatedUserSettings!
    deleteUser: Boolean!
    createTodo(todoInput: CreateTodoInputData) : Todo!
    updateTodo(todoInput: UpdateTodoInputData, todoId: ID!) : Todo!
    deleteTodo(todoId: ID!) : Boolean!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)