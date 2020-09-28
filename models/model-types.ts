import { ObjectID } from 'mongodb'

export interface Itodo {
  creator: Follower;
  task: string;
  completed: true;
  timeToComplete: number | undefined;
  public: boolean;
  tags: string[];
}

export interface Iconversation{
  participants: Follower[];
  messages: Message[] | [];
}

export type Message = {
  id: string;
  author: string;
  text: string;
  writtenAt: Date;
}

export type Follower = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface IUserInfo {
  username: string
  approveEmailToken: string
  firstname: string
  lastname: string
  email: string
  password: string
  public: boolean
  phone: string | undefined
  website: string | undefined
  company: string | undefined
  about: string | undefined
  relationshipStatus: string | undefined
}


export interface IDialogue {
  _id: ObjectID,
  participants: Follower[]
  latestMessage: Message
}