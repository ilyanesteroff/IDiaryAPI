import mongo from 'mongodb'
import { getDb } from '../utils/db-connection'
import { Iconversation, Follower, Message } from './model-types'

export class Conversation {
  parcicipants: Follower[]
  messages: Message[] | []
  constructor(convInfo: Iconversation){
    this.parcicipants = convInfo.participants
    this.messages = convInfo.messages
  }

  save() {
    return getDb().collection('Conversations')
      .insertOne(this)
  }

  static findConversation(query: object) {
    return getDb().collection('Conversations')
      .findOne(query)
  }

  static findManyConversationsForOneUser(userId: string) {
    return getDb().collection('Convarsations')
      .find({ 
          $elemMatch : 
            { 
              participants : 
                { 
                  id : new mongo.ObjectID(userId)
                }
            } 
      })
      .toArray()
  }

  static findDialogue(user1Id: string, user2Id: string) {
    return getDb().collection('Conversations')
    //because there can be only one dialogue between only 2 users 
      .findOne({
        participants: {
          $elemMatch: {
            $and: [
                { _id : new mongo.ObjectID(user1Id) },
                { _id : new mongo.ObjectID(user2Id) }
            ]
          }
        }  
      })
  }

  static addMassage(conversationId: string, message: Message){
    return getDb().collection('Conversations')
      .findOneAndUpdate({ _id: new mongo.ObjectID(conversationId)}, {
            $push : {
              messages: message
            } 
      })
  }

  static deleteMessageForAll(conversationId: string, messageId: string){
    return getDb().collection('Conversations')
      .findOneAndUpdate({ _id: new mongo.ObjectID(conversationId)}, {
         $pull : {
            messages : {
                id : messageId
            }
         }
      })
  }  
}