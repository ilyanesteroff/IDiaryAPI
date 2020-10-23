import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { follower, IRequest } from './model-types'


export class Request extends DbModel{
  static collection: string = 'Requests'
  constructor(requestInfo: IRequest){
    super('Requests', requestInfo)
  }

  static findRequestFrom(userId: string, username: string){
    return this.getModel(
      { 
        "sender.username" : username,
        "receiver._id" : userId 
      }, 
      this.collection
    )
  }

  static findRequestsTo(userId: string, username: string){
    return this.getModel(
      { 
        "receiver.username" : username,
        "sender._id" : userId 
      }, 
      this.collection
    )
  }

  static findManyRequestForReceiver(receiverId: string, currentPage: number, limit: number){
    return this.getManyModels({ "receiver._id": receiverId }, this.collection,  {createdAt: -1}, currentPage, limit)
  }

  static findManyRequestForSender(senderId: string, currentPage: number, limit: number){
    return this.getManyModels({ "sender._id": senderId }, this.collection,  {createdAt: -1}, currentPage, limit)
  }

  static deleteRequest(id: string){
    return this.deleteModel(new ObjectID(id), this.collection)
  }

  static deleteAllRequestsForSender(senderId: string){
    return this.deleteManyModels({ "sender._id" : senderId }, this.collection)
  }

  static deleteAllRequestsForReceiver(receiverId: string){
    return this.deleteManyModels({ "receiver._id" : receiverId }, this.collection)
  }

  static updateSenderForManyRequests(senderId: string, sender: follower){
    return this.updateManyModels({ "sender._id" : senderId }, {
      $set: {
        sender: sender
      }
    }, this.collection)
  }

  static updateReceiverForManyRequests(receiverId: string, receiver: follower){
    return this.updateManyModels({ "sender._id" : receiverId }, {
      $set: {
        receiver: receiver
      }
    }, this.collection)
  }

  static countIncomingRequests(userId: string){
    return this.countModels({ "receiver._id" : userId }, this.collection)
  }

  static countOutcomingRequests(userId: string){
    return this.countModels({ "sender._id" : userId }, this.collection)
  }
}