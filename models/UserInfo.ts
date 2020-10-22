import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IUserInfo } from './model-types'

export class UserInfo extends DbModel{
  static collection: string = 'UserInfo'
  constructor(userInfo: IUserInfo){
    super('UserInfo', userInfo)
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
    return this.updateModel(new ObjectID(userId), data, this.collection)
  }

  static getUserInfo(userId: string){
    return this.getModel({ _id: new ObjectID(userId) }, this.collection)
  }
}