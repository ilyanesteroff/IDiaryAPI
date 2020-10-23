import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IUserSettings } from './model-types'

export class UserSettings extends DbModel{
  static collection: string = 'UserSettings'
  constructor(userSettings: IUserSettings){
    super('UserSettings', {
      ...userSettings,
      _id: new ObjectID(userSettings._id),
    })
  }

  static deleteUserSettings(id: string){
    return this.deleteModel(new ObjectID(id), this.collection)
  }

  static updateUserSettings(id: string, data: object){
    return this.updateAndReturnModel(new ObjectID(id), data, this.collection)
  }

  static getUserSettings(query: object){
    return this.getModel(query, this.collection)
  }
  
  static getSpecificFields(query: object, project: object){
    return this._getSpecificFields(query, project, this.collection)
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

  static unsetResetPasswordToken(userId: string){
    return this.updateModel(new ObjectID(userId), {
      $unset : {
        resetPassword: ""
      }
    }, this.collection)
  }

  static acceptEmail(userId: string) {
    return this.updateModel(new ObjectID(userId),  
    { 
      $set: { 
        approved: true 
      }, 
      $unset: { 
        approveEmailToken: "" 
      } 
    }, this.collection)
  }
}