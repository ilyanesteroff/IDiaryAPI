import mongo from 'mongodb'
import { Itodo, Follower } from './model-types'
import { getDb } from './../utils/db-connection'

export class Todo{
  task: string
  creator: Follower
  completed: boolean
  createdAt: Date
  timeToComplete: number | undefined
  public: boolean
  tags: string[] | undefined

  constructor(todo: Itodo){
    this.creator = todo.creator
    this.task = todo.task
    this.completed = todo.completed
    this.createdAt = new Date()
    if(todo.timeToComplete) this.timeToComplete = todo.timeToComplete
    this.public = todo.public
    if(todo.tags) this.tags = todo.tags
  }
  save() {
    return getDb().collection('Todos').insertOne(this).catch(err => err)
  }

  static updateTodo(todoId : string, info: object) {
    return getDb().collection('Todos')
      .findOneAndUpdate({ _id: new mongo.ObjectID(todoId)}, info)
      .catch(err => err)
  }
  //findOne
  static findOneTodo(query: object) {
    return getDb().collection('Todos')
      .findOne(query)
      .catch(err => err)
  }

  static findManyTodos(query: object, currentPage: number, limit: number) {
    return getDb().collection('Todos')
      .find(query)
      .sort({createdAt: -1})
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .toArray()
      .catch(err => err)
  }

  static countTodos(query: object) {
    return getDb().collection('Todos')
      .count(query)
      .catch(err => err)
  }
    
  static deleteTodo(todoId: string) {
    return getDb().collection('Todos')
      .deleteOne({ _id: new mongo.ObjectID(todoId) })
      .catch(err => err)
  }

  static deleteTodosOfDeletedUser(userId: string) {
    return getDb().collection('Todos')
      .deleteMany({ "creator._id" : userId })
      .catch(err => err)
  }
}