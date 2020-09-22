const mongo = require('mongodb')
const { getDb } = require('../utils/db-connection')

exports.User = class {
  constructor(userInfo) {
    this.username = userInfo.username
    this.firstname = userInfo.firstname
    this.lastname = userInfo.lastname
    this.email = userInfo.email
    this.Todos = []
    this.followers = []
    this.following = []
    this.FulfilledTodos = 0
    this.FailedTodos = 0
    if(userInfo.phone) this.phone = userInfo.phone
    this.password = userInfo.password
    this.createdAt = new Date()
    this.approved = false
    this.requests = []
    this.messages = []
    this.blacklist = []
  }

  save() {
    return getDb().collection('Users').insertOne(this)
  }

  static updateUser(userId, info) {
    return getDb().collection('Users')
      .findOneAndUpdate({ _id: new mongo.ObjectID(userId)}, { $set : info })
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
            bestBefore: new Date()
          }
        }
      })
  }
  
  static getSpecificField(userId, fieldName){
    return getDb().collection('Users')
      .findOne({ _id: new mongo.ObjectID(userId)})
      //.select(fieldName)
  }
}