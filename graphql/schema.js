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
    password: String
  }

  type UpdatedUserInfo {
    website: String!
    company: String!
    about: String!
    relationshipStatus: String!
  }

  type UpdatedUserSettings {
    public: !Boolean
    phone: String
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
    website: String!
    company: String!
    about: String!
    relationshipStatus: String!
  }

  input UpdatedUserSettingsData{
    public: Boolean
    phone: String
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
    todos(userId: ID, page: Int!) : [Todo]!
    user(userId: ID): User!
    findUser(username: String!) : Follower!
    followingOrFollowers(userId: ID, field: String!): [FollowingInfo]!
    conversations(page: Int!): [Conversation]!
    findTodosByTagname(tag: String!, page: Int!) : [Todo]!
  }

  type RootMutation {
    createUser(userInput: CreateUserInputData) : Boolean!
    updateUser(userInput: UpdateUserInputData) : UpdatedUser!
    updateUserInfo(userInput: UpdateUserInfoData) : UpdatedUserInfo!
    updateUserSettings(userInput: UpdatedUserSettingsData) : UpdatedUserSettings!
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
/*  public: Boolean
    phone: String
    website: String
    company: String
    about: String
    relationshipStatus: String  */