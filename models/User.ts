import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IUser, FullUser } from './model-types'


export class User extends DbModel{
  static collection: string = 'Users'

  constructor(userInfo: IUser){
    super('Users', {
      ...userInfo, 
      createdAt: new Date(),
    })
  }

  static updateUser(userId: string, data: object) {
    return this.updateAndReturnModel(new ObjectID(userId), data, this.collection)
  }

  static deleteUser(userId: string) {
    return this.deleteModel(new ObjectID(userId), this.collection)
  }

  static findUser(query: object) {
    return this.getModel(query, this.collection)
  }
  
  static getSpecificFields(query: object, project: object){
    return this._getSpecificFields(query, project, this.collection)
  }
 
  static formatUserAsFollower(user: FullUser) {
    return {
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    }
  }
}