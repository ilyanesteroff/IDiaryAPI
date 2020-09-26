const mongo = require('mongodb')
const { getDb } = require('../utils/db-connection')

exports.User = class {
  constructor(userInfo) {
    this.username = userInfo.username
    this.firstname = userInfo.firstname
    this.lastname = userInfo.lastname
    this.email = userInfo.email
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

  static updateUser(userId, info) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, info)
  }

  static deleteUser(userId) {
    return getDb().collection('Users')
      .findOneAndDelete({ _id : new mongo.ObjectID(userId)})
  }

  static getUser(username) {
    return getDb().collection('Users')
      .findOne({ username: username})
  }

  static findUser(query) {
    return getDb().collection('Users')
      .findOne(query)
  }
  //can be used for sending messages, todos and requests
  static pushSomething(userId, fieldName, fieldValue) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, { $push :
        { 
          [fieldName]: fieldValue
        }
      })
  }
  //
  static pullSomething(userId, fieldName, query) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, {
        $pull : {
          [fieldName] : query
        }
      })
  }

  static setResetPasswordToken(userId, token) {
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
  
  static getSpecificField(userId, params){
    return getDb().collection('Users')
      .findOne({ _id: new mongo.ObjectID(userId)}, params)
  }

  static formatUserAsFollower(user){
    return {
      _id: user._id.toString(),
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    }
  }
}