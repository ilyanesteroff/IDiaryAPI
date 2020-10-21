import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IMessage } from './model-types'

export default class Message extends DbModel{
  static collection: string = 'Messages'
  constructor(messageInfo: IMessage){
    super('Messages', messageInfo)
  }

  static viewMessages(convId: string){
    return this.updateManyModels({ 
      conversationID: new ObjectID(convId),
      seen: false
    }, { $set : { seen : true }}, this.collection)
  }

  static findManyMessages(query: object, currentPage: number, limit: number){
    return this.getManyModels(query, this.collection, {createdAt: -1}, currentPage, limit)
  }

  static changeMessageText(messageId: string, text: string){
    return this.updateAndReturnModel(new ObjectID(messageId), {
      $set: {
        text : text
      }
    }, this.collection)
  }

  static updateManyMessages(query: object, data: object){
    return this.updateManyModels(query, data, this.collection)
  }

  static deleteMessage(messageId: string){
    return this.deleteModel(new ObjectID(messageId), this.collection)
  }

  static likeMessage(messageId: string){
    return this.updateAndReturnModel(new ObjectID(messageId), {
      $set: {
        liked: true
      }
    }, this.collection)
  }

  static unlikeMessage(messageId: string){
    return this.updateAndReturnModel(new ObjectID(messageId), {
      $set: {
        liked: false
      }
    }, this.collection)
  }

  static getLikedMessages(convId: string, currentPage: number, limit: number){
    return this.getManyModels({ 
      conversationID: convId, 
      liked: true 
    }, this.collection, {createdAt: -1}, currentPage, limit)
  }
}