import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IUserSettings } from './model-types'

export default class UserSettings extends DbModel{
  static collection: string = 'UserSettings'
  constructor(userInfo: IUserSettings){
    super('UserInfo', userInfo)
  }

  static deleteUserInfo(id: string){
    return this.deleteModel(new ObjectID(id), this.collection)
  }

  static updateUserInfo(id: string, data: object){
    return this.updateModel(new ObjectID(id), data, this.collection)
  }

  static getUserInfo(query: object){
    return this.getModel(query, this.collection)
  }
  
  static setResetPasswordToken(userId: string, token: string) {
    return this.updateModel(new ObjectID(userId), {
      $set : {
        resetPassword: {
          token: token,
          bestBefore: new Date().getTime() + 7400000
        }
      }
    }, this.collection)
  }
}