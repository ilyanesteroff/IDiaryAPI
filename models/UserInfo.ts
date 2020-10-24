import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IUserInfo } from './model-types'

export class UserInfo extends DbModel{
  static collection: string = 'UserInfo'
  constructor(userInfo: IUserInfo){
    super('UserInfo', {
      ...userInfo,
      _id: new ObjectID(userInfo._id),
      FullfilledTodos: 0,
      ActiveTodos: 0
    })
  }

  static setLastSeen(userId: string){
    return this.updateModel(new ObjectID(userId), {
      $set : {
        lastSeen: new Date()
      }
    }, this.collection)
  }

  static getSpecificFields(query: object, project: object){
    return this._getSpecificFields(query, project, this.collection)
  }

  static deleteUserInfo(userId: string){
    return this.deleteModel(new ObjectID(userId), this.collection)
  }

  static updateUserInfo(userId: string, data: object){
    return this.updateAndReturnModel(new ObjectID(userId), data, this.collection)
  }

  static increaseActiveTodos(userId: string){
    return this.updateModel(new ObjectID(userId), { $inc : { ActiveTodos: 1 } }, this.collection)
  }

  static increaseCompletedTodos(userId: string){
    return this.updateModel(new ObjectID(userId), { $inc : { FullfilledTodos: 1 } }, this.collection)
  }

  static decreaseActiveTodos(userId: string){
    return this.updateModel(new ObjectID(userId), { $inc : { ActiveTodos: -1 } }, this.collection)
  }

  static decreaseCompletedTodos(userId: string){
    return this.updateModel(new ObjectID(userId), { $inc : { FullfilledTodos: -1 } }, this.collection)
  }

  static getUserInfo(userId: string){
    return this.getModel({ _id: new ObjectID(userId) }, this.collection)
  }
}