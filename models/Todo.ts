import { ObjectID } from 'mongodb'
import { Itodo, TodoAuthor } from './model-types'
import DbModel from './Model'


export class Todo extends DbModel{
  static collection: string = 'Todos'
  constructor(todo: Itodo){
    super('Todos', {
      ...todo, 
      createdAt: new Date()
    })
  }

  static updateTodo(todoId : string, data: object) {
    return this.updateAndReturnModel(new ObjectID(todoId), data, this.collection)
  }
  
  static updateCreatorName(creatorId: string, newUsername: string){
    return this.updateManyModels({ "creator._id" : creatorId }, { $set: { "creator.username" : newUsername } }, this.collection)
  }
  
  static updateCreatorPrivacy(creatorId: string, privacy: boolean){
    return this.updateManyModels({ "creator._id" : creatorId }, { $set: { "creator.public" : privacy } }, this.collection)
  }

  static getSpecificFields(query: object, project: object){
    return this._getSpecificFields(query, project, this.collection)
  }
  
  static findManyTodos(query: object, currentPage: number, limit: number) {
    return this.getManyModels(query, this.collection, {createdAt: -1}, currentPage, limit)
  }
  
  static countTodos(query: object) {
    return this.countModels(query, this.collection)
  }
    
  static deleteTodo(id: string){
    return this.deleteModel(new ObjectID(id), this.collection)
  }

  static deleteTodosOfDeletedUser(userId: string) {
    return this.deleteManyModels({ "creator._id" : userId }, this.collection)
  }
}