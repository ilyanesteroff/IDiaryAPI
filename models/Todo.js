const mongo = require('mongodb')
const { getDb } = require('../utils/db-connection')


exports.Todo = class{
  constructor(todoInfo){
    this.creatorId = todoInfo.creatorId
    this.task = todoInfo.task
    this.completed = todoInfo.completed
    this.createdAt = new Date()
    this.timeToComplete = todoInfo.timeToComplete
    this.public = todoInfo.public
    if(todoInfo.tags) this.tags = todoInfo.tags
  }
  //for create todo
  save() {
    return getDb().collection('Todos').insertOne(this)
  }

  static updateTodo(todoId, info) {
    return getDb().collection('Todos')
      .findOneAndUpdate({ _id: new mongo.ObjectID(todoId)}, info)
  }
  //findOne
  static findOneTodo(query) {
    return getDb().collection('Todos')
      .findOne(query)
  }

  static findManyTodos(query) {
    return getDb().collection('Todos')
      .find(query)
      .toArray()
  }

  static deleteTodo(todoId) {
    return getDb().collection('Todos')
      .deleteOne({ _id: new mongo.ObjectID(todoId) })
  }
}