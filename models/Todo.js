const mongo = require('mongodb')
const { getDb } = require('../utils/db-connection')

exports.Todo = class {
  constructor(todoInfo){
    this.task = todoInfo.task
    this.completed = todoInfo.completed
    this.createdAt = new Date()
    this.timeToComplete = todoInfo.timeToComplete
    this.overdued = false
  }

  save() {
    return getDb().collection('Todos').insertOne(this)
  }
}