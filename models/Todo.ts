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
    this.timeToComplete = todo.timeToComplete
    this.public = todo.public
    if(todo.tags) this.tags = todo.tags
  }
  save() {
    return getDb().collection('Todos').insertOne(this)
  }

  static updateTodo(todoId : string, info: object) {
    return getDb().collection('Todos')
      .findOneAndUpdate({ _id: new mongo.ObjectID(todoId)}, info)
  }
  //findOne
  static findOneTodo(query: object) {
    return getDb().collection('Todos')
      .findOne(query)
  }

  static findManyTodos(query: object) {
    return getDb().collection('Todos')
      .find(query)
      .toArray()
  }

  static deleteTodo(todoId: string) {
    return getDb().collection('Todos')
      .deleteOne({ _id: new mongo.ObjectID(todoId) })
  }
}