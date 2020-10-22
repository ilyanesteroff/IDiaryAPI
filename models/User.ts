import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { getDb } from '../utils/db-connection'
import { IUser, FullUser } from './model-types'


export class User extends DbModel{
  static collection: string = 'Users'

  constructor(userInfo: IUser){
    super('Users', {
      ...userInfo, 
      createdAt: new Date(),
    })
  }

  static updateUser(userId: string, info: object) {
    return DbModel.updateModel(new ObjectID(userId), info, this.collection)
  }

  static deleteUser(userId: string) {
    return DbModel.deleteModel(new ObjectID(userId), this.collection)
  }

  static findUser(query: object) {
    return DbModel.getModel(query, this.collection)
  }
  
  static getSpecificFields(query: object, project: object){
    return getDb().collection(this.collection)
      .aggregate([ 
        { $match : query },
        { $project: project }
      ])
      .toArray()
      .catch(err => err)
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