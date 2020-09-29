import mongo, { ObjectID } from 'mongodb'
import { getDb } from '../utils/db-connection'
import { IUserInfo, IDialogue } from './model-types'

export class User {
  _id: ObjectID | undefined
  username: string
  firstname: string
  lastname: string
  email: string
  approveEmailToken: string
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
    this.approveEmailToken = userInfo.approveEmailToken
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
    return getDb().collection('Users').insertOne(this).catch(err => err)
  }

  static updateUser(userId: string, info: object) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, info)
      .catch(err => err)
  }

  static deleteUser(userId: string) {
    return getDb().collection('Users')
      .findOneAndDelete({ _id : new mongo.ObjectID(userId)})
      .catch(err => err)
  }
  //in future get rid of this
  static getUser(username: object) {
    return getDb().collection('Users')
      .findOne({username: username})
      .catch(err => err)
  }

  static findUser(query: object) {
    return getDb().collection('Users')
      .findOne(query)
      .catch(err => err)
  }
  //can be used for sending messages, todos and requests
  static pushSomething(userId: string, fieldName: string, fieldValue: any) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, { $push :
        { 
          [fieldName]: fieldValue
        }
      })
      .catch(err => err)
  }
  //
  static pullSomething(userId: string, fieldName: string, query: object) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, {
        $pull : {
          [fieldName] : query
        }
      })
      .catch(err => err)
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
      .catch(err => err)
  }
  
  static getSpecificFields(query: object, project: object){
    return getDb().collection('Users')
      .aggregate([ 
        { $match : query },
        { $project: project }
      ])
      .toArray()
      .catch(err => err)
  }

  static formatUserAsFollower(user: User) {
    return {
      _id: user._id? user._id.toString() : undefined,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    }
  }

  static updateDialogues(dialogue: IDialogue){
    return getDb().collection('Users').updateMany(
      { dialogues: { $elemMatch: { _id: dialogue._id } } },
      { $set: { "dialogues.$.latestMessage" : dialogue.latestMessage } }
    )
    .catch(err => err)
  }

  static deleteDialogues(id: string){
    return getDb().collection('Users').updateMany(
      { dialogues: { $elemMatch: { _id: id } } },
      { $pull: { dialogues : { _id : id }}}
    )
  }

  static deleteRequestsOfDeletedUser(userId: string, fieldName: string){
    return getDb().collection('Users')
      .updateMany(
        { [fieldName] : { $elemMatch: { _id: userId }}},
        { $pull : { [fieldName] : { _id: userId } } }
      )
      .catch(err => err)
  }
}