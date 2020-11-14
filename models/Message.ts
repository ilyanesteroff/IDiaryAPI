import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { IMessage } from './model-types'


export class Message extends DbModel{
  static collection: string = 'Messages'
  constructor(messageInfo: IMessage){
    super('Messages', {
      ...messageInfo,
      writtenAt: new Date(),
      seen: false
    })
  }

  static viewMessages(convId: string, to: string){
    return this.updateManyModels({ 
      conversationID: convId,
      seen: false,
      to: to
    }, { $set : { seen : true }}, this.collection)
  }

  static getSpecificFields(messageId: string, project: object){
    return this._getSpecificFields({ _id: new ObjectID(messageId) }, project, this.collection)
  }

  static findManyMessages(query: object, currentPage: number, limit: number){
    return this.getManyModels(query, this.collection, {writtenAt: 1}, currentPage, limit)
  }

  static changeMessageText(messageId: string, text: string){
    return this.updateAndReturnModel(new ObjectID(messageId), {
      $set: {
        text : text
      }
    }, this.collection)
  }

  static updateAuthorInManyMassages(oldName: string, newName: string){
    return this.updateManyModels({ author: oldName }, { $set : { author: newName } }, this.collection)
  }

  static updateManyMessages(query: object, data: object){
    return this.updateManyModels(query, data, this.collection)
  }

  static deleteMessage(messageId: string){
    return this.deleteModel(new ObjectID(messageId), this.collection)
  }

  static toggleLikeMessage(messageId: string, like: boolean){
    return this.updateAndReturnModel(new ObjectID(messageId), {
      $set: {
        liked: like
      }
    }, this.collection)
  }

  static getLatestMessage(convId: string){
    return this.getManyModels({
      conversationID: convId,
    }, this.collection, { writtenAt: -1 }, 1, 1)
      .then(res => res[0])
  }

  static countMessages(convID: string){
    return this.countModels({ conversationID: convID }, this.collection)
  }

  static countUnseenMessages(userId: string){
    return this.countModels({ seen: false, to: userId }, this.collection)
  }
}