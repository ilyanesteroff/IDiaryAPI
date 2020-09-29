import mongo, { ObjectID } from 'mongodb'
import { getDb } from '../utils/db-connection'
import { Iconversation, Follower, Message } from './model-types'

export class Conversation {
  _id: ObjectID | undefined
  participants: Follower[]
  messages: Message[] | []
  constructor(convInfo: Iconversation){
    this.participants = convInfo.participants
    this.messages = convInfo.messages
  }

  save() {
    return getDb().collection('Conversations')
      .insertOne(this)
      .catch(err => err)
  }

  static findConversation(query: object) {
    return getDb().collection('Conversations')
      .findOne(query)
      .catch(err => err)
  }

  static destroyConversation(query: object){
    return getDb().collection('Conversations')
      .deleteOne(query)
      .catch(err => err)
  }

  static findDialogue(participants: Follower[]) {
    return getDb().collection('Conversations')
    //because there can be only one dialogue between only 2 users 
      .findOne({
        participants: participants
      })
      .catch(err => err)
  }

  static addMassage(conversationId: string, message: Message){
    return getDb().collection('Conversations')
      .findOneAndUpdate({ _id: new mongo.ObjectID(conversationId)}, {
        $push : {
          messages: message
        } 
      })
      .then(_ => {
        return getDb().collection('Conversations')
          .findOne({ _id: new mongo.ObjectID(conversationId) })
      })
      .catch(err => err)
  }

  static updateMessage(convId: string, messageId: string, text: string){
    return getDb().collection('Conversations')
      .findOneAndUpdate(
        {_id: new mongo.ObjectID(convId),  messages: { $elemMatch: { id: messageId } } }, 
        { $set: { "messages.$.text" : text } }
      )
      .then(_ => {
        return getDb().collection('Conversations')
          .findOne({ _id: new mongo.ObjectID(convId) })
      })
      .catch(err => err)
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
      .then(_ => {
        return getDb().collection('Conversations')
          .findOne({ _id: new mongo.ObjectID(conversationId) })
      })
      .catch(err => err)
  }  

  static formatAsDialogue(conv: Conversation){
    return {
      _id: conv._id? conv._id.toString() : undefined, 
      participants: conv.participants, 
      latestMessage: {
        id: conv.messages[conv.messages.length-1].id,
        writtenAt: conv.messages[conv.messages.length-1].writtenAt,
        text: conv.messages[conv.messages.length-1].text,
        author: conv.messages[conv.messages.length-1].author
      }
    }
  }
}