import mongo, { ObjectID } from 'mongodb'
import { getDb } from '../utils/db-connection'
import { IUserInfo, Follower } from './model-types'

export class User {
  _id: ObjectID | undefined
  username: string
  firstname: string
  lastname: string
  email: string
  dialogues: []
  followers: []
  following: []
  FullfilledTodos: 0
  ActiveTodos: 0
  password: string
  createdAt: Date
  approved: boolean
  requestsTo: []
  requestsFrom: []
  blacklist: []
  public: boolean
  phone: string | undefined
  website: string | undefined
  company: string | undefined
  about: string | undefined
  relationshipStatus: string | undefined

  constructor(userInfo: IUserInfo){
    this.username = userInfo.username
    this.firstname = userInfo.firstname
    this.lastname = userInfo.lastname
    this.email = userInfo.email
    this.dialogues = []
    this.followers = []
    this.following = []
    this.FullfilledTodos = 0
    this.ActiveTodos = 0
    this.password = userInfo.password
    this.createdAt = new Date()
    this.approved = false
    this.requestsTo = []
    this.requestsFrom = []
    this.blacklist = []
    this.public = userInfo.public
    if(userInfo.phone) this.phone = userInfo.phone
    if(userInfo.website) this.website = userInfo.website
    if(userInfo.company) this.company = userInfo.company
    if(userInfo.about) this.about = userInfo.about
    if(userInfo.relationshipStatus) this.relationshipStatus = userInfo.relationshipStatus
  }

  save() {
    return getDb().collection('Users').insertOne(this)
  }

  static updateUser(userId: string, info: object) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, info)
  }

  static deleteUser(userId: string) {
    return getDb().collection('Users')
      .findOneAndDelete({ _id : new mongo.ObjectID(userId)})
  }

  static getUser(username: object) {
    return getDb().collection('Users')
      .findOne({ username: username})
  }

  static findUser(query: object) {
    return getDb().collection('Users')
      .findOne(query)
  }
  //can be used for sending messages, todos and requests
  static pushSomething(userId: string, fieldName: string, fieldValue: any) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, { $push :
        { 
          [fieldName]: fieldValue
        }
      })
  }
  //
  static pullSomething(userId: string, fieldName: string, query: object) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, {
        $pull : {
          [fieldName] : query
        }
      })
  }

  static setResetPasswordToken(userId: string, token: string) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, {
        $set : {
          resetPassword: {
            token: token,
            bestBefore: new Date().getTime() + 7400000
          }
        }
      })
  }
  
  static getSpecificField(userId: string, params: object){
    return getDb().collection('Users')
      .findOne({ _id: new mongo.ObjectID(userId)}, params)
  }

  static formatUserAsFollower(user: User) {
    return {
      _id: user._id? user._id.toString() : undefined,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    }
  }
}