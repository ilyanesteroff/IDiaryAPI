import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { Iconversation, Message } from './model-types'

export class Conversation extends DbModel{
  static collection : string = 'Conversations'
  constructor(convInfo: Iconversation){
    super('Conversations', {
      ...convInfo,
      unseenMessages: 0
    })
  }

  static getConversation(convId: string){
    return this.getModel({ _id: new ObjectID(convId) }, this.collection)
  }

  static getSpecificFields(convId: string, project: object){
    return this._getSpecificFields({ _id: new ObjectID(convId) }, project, this.collection)
  }

  static getConversationByUserneme(username: string, user1Id: string){
    return this.getModel({ 
      $and : [
        { "participants" : { $elemMatch : { _id: user1Id } } },
        { "participants" : { $elemMatch : { username: username } } }
      ]
    }, this.collection)
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
  
  static increaseUnseenMessages(convId: string){
    return this.updateModel(new ObjectID(convId), { $inc : { unseenMessages : 1 } }, this.collection)
      .then(_ => {
        return this.getConversation(convId)
      })
  }

  static decreaseUnseenMessages(convId: string){
    return this.updateModel(new ObjectID(convId), { $inc : { unseenMessages : -2 } }, this.collection)
      .then(_ => {
        return this.getConversation(convId)
      })
  }

  static unsetUnseenMessages(convId: string){
    return this.updateModel(new ObjectID(convId), { $set : { unseenMessages : 0 } }, this.collection)
  }

  static updateUserInManyConversations(userId: string, newUser: object){
    return this.updateManyModels({ "participants._id": userId }, { $set: { "participants.$": newUser } }, this.collection)
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