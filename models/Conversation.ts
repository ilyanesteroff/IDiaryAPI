import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { Iconversation, Message } from './model-types'

export class Conversation extends DbModel{
  static collection : string = 'Conversations'
  constructor(convInfo: Iconversation){
    super('Conversations', convInfo)
  }

  static getSpecificFields(convId: string, project: object){
    return this._getSpecificFields({ _id: new ObjectID(convId) }, project, this.collection)
  }

  static findManyConversationsForOneUser(userId: string, currentPage: number, limit: number){
    return this.getManyModels({ 
      participants: { 
        $elemMatch: { 
          _id: userId 
        } 
      } 
    }, this.collection, {updatedAt: -1}, currentPage, limit)
  }

  static destroyConversation(id: string){
    return this.deleteModel(new ObjectID(id), this.collection)
  }

  static setAnotherLatestMessage(id: string, message: Message, updatedAt: Date | null){
    return this.updateModel(new ObjectID(id), {
      $set : {
        latestMessage: message,
        updatedAt: updatedAt || new Date()
      }
    }, this.collection)
  }
  //mb remove this
  static updateManyConversations(query: object, data: object){
    return this.updateManyModels(query, data, this.collection)
  }

  static updateUserInManyConversations(userId: string, newUser: object){
    return this.updateManyConversations(
      { "participants._id": userId }, 
      { $set: { "participants.$": newUser } }
    )
  }

  static countConversations(userId: string){
    return this.countModels({ 
      participants: { 
        $elemMatch: { 
          _id: userId 
        } 
      } 
    }, this.collection)
  }
}