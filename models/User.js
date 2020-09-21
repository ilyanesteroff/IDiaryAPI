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
    this.FulfilledTodos = 0
    this.FailedTodos = 0
    if(userInfo.phone) this.phone = userInfo.phone
    this.password = userInfo.password
    this.createdAt = new Date()
  }

  save() {
    return getDb().collection('Users').insertOne(this)
  }
}