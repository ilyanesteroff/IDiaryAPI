const mongo = require('mongodb')
const { getDb } = require('../utils/db-connection')


exports.Conversation = class{
  constructor(conversationInfo){
    this.participants = conversationInfo.participants
    this.messages = conversationInfo.messages || []
  }

  save() {
    return getDb().collection('Conversations')
      .insertOne(this)
  }

  static findConversation(query) {
    return getDb().collection('Conversations')
      .findOne(query)
  }

  static findManyConversationsForOneUser(userId) {
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

  static findDialogue(user1Id, user2Id) {
    return getDb().collection('Conversations')
    //because there can be only one dialogue between only 2 users 
      .findOne({
          $elemMatch : {
            $and : [
              {
                participants : { 
                  id : new mongo.ObjectID(user1Id)
                }
              },
              {
                participants : { 
                  id : new mongo.ObjectID(user2Id)
                }
              }
            ]
          }
      })
  }

  static addMassage(conversationId, message){
    return getDb().collection('Conversations')
      .findOneAndUpdate({ _id: new mongo.ObjectID(conversationId)}, {
            $push : {
              messages: message
            } 
      })
  }

  static deleteMessageForAll(conversationId, messageId){
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