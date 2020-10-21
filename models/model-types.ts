import { ObjectID } from 'mongodb'

export interface Itodo {
  creator: follower
  task: string
  completed: true
  timeToComplete: number | undefined
  public: boolean
  tags: string[] | undefined
}

export interface Iconversation{
  participants: follower[]
  latestMessage: IMessage
  updatedAt: Date | null
}

export interface IMessage{
  conversationID: string
  author: string
  text: string
  writtenAt: Date
  seen: boolean
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
  FullfilledTodos: number
  ActiveTodos: number
  createdAt: Date
}

export interface IUser {
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface IUserSettings{
  _id: ObjectID
  public: boolean
  approveEmailToken: string | null
  approved: boolean
  phone: string | undefined
  website: string | undefined
  company: string | undefined
  about: string | undefined
  relationshipStatus: string | undefined
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