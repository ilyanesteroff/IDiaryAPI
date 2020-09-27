
export interface Itodo {
  creatorId: string;
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
  from: string;
  to: string;
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
