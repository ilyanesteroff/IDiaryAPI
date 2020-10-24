import { ObjectID } from 'mongodb'

export interface Itodo {
  creator: TodoAuthor
  task: string
  completed: true
  timeToComplete: number | undefined
  public: boolean
  tags: string[] | undefined
}

export interface Iconversation{
  participants: follower[]
  latestMessage: IMessage | null
  updatedAt: Date | null
}

export interface IMessage{
  conversationID: string
  author: string
  text: string
}

export type TodoAuthor = {
  _id: string
  username: string
  public: Boolean
}

export type Message = {
  _id: string
  conversationID: string
  author: string
  text: string
  writtenAt: Date
  seen: boolean
  liked: boolean | null
}

export type follower = {
  _id: string
  firstname: string
  lastname: string
  username: string
}

export type FullUser = {
  _id: string
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
  createdAt: Date
}

export interface IUser {
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface IUserInfo {
  _id: ObjectID
  FullfilledTodos: number | undefined
  ActiveTodos: number | undefined
  website: string | undefined
  company: string | undefined
  about: string | undefined 
  relationshipStatus: string | undefined
}

export interface IUserSettings{ 
  _id: ObjectID
  public: boolean
  approveEmailToken: string 
  approved: boolean
  phone: string | undefined
}

export interface IRequest{
  sender: follower
  receiver: follower
  sentAt: Date
}

export interface IFollower{
  followingTo: follower
  follower: follower
  followingSince: Date
}

export interface IBlock{
  blockedUser: follower
  userWhoBlocked: string
  reason: string | null
}