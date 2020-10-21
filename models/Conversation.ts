import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { Iconversation, Message } from './model-types'

export class Conversation extends DbModel{
  static collection : string = 'Conversations'
  constructor(convInfo: Iconversation){
    super('Conversations', convInfo)
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

  static setAnotherLatestMessage(id: string, message: Message){
    return this.updateModel(new ObjectID(id), {
      $set : {
        latestMessage: message,
        updatedAt: new Date()
      }
    }, this.collection)
  }

  static updateManyConversations(query: object, data: object){
    return this.updateManyModels(query, data, this.collection)
  }
}