import { ObjectID } from 'mongodb'
import DbModel from './Model'
import { follower, IFollower } from './model-types' 

export class Follower extends DbModel{
  static collection: string = 'Followers' 
  constructor(followingData: IFollower){
    super('Followers', followingData)
  }

  static findFollower(userId: string, username: string){
    return this.getModel(
      { 
        "follower.username" : username,
        "followingTo._id" : userId                         
      }, 
      this.collection
    )
  }

  static findFollowing(userId: string, username: string){
    return this.getModel(
      { 
        "followingTo.username" : username, 
        "follower._id" : userId
      }, 
      this.collection)
  }

  static findManyFollowers(userId: string, currentPage: number, limit: number){
    return this.getManyModels(
      { "followingTo._id" : userId }, 
      this.collection, 
      {"follower.username": -1},
      currentPage,
      limit
    )
  }

  static findManyFollowings(userId: string, currentPage: number, limit: number){
    return this.getManyModels(
      { "follower._id" : userId }, 
      this.collection, 
      {"followingTo.username": -1},
      currentPage,
      limit
    )
  }

  static updateFollower(followerId: string, newFollower: follower){
    return this.updateManyModels({ "follower._id" : followerId }, {
      $set: {
        follower: newFollower
      }
    }, this.collection)
  }

  static updateFollowing(followingId: string, newFollowing: follower){
    return this.updateManyModels({ "followingTo._id" : followingId }, {
      $set: {
        followingTo: newFollowing
      }
    }, this.collection)
  }

  static unfollowOrRemoveFollower(followId: string){
    return this.deleteModel(new ObjectID(followId), this.collection)
  }

  static deleteFollowersAndFollowings(userId: string){
    return this.deleteManyModels(
      {
        $or: [
            { "followingTo._id": userId }, { "follower._id": userId }
        ]
      }, this.collection)
  }

  static handleUserBlocking(user1Id: string, user2Id: string){
    return this.deleteManyModels(
      {
        $or : [
          { "followingTo._id": user1Id ,  "follower._id": user2Id },
          { "followingTo._id": user2Id ,  "follower._id": user1Id }
        ]
      }, this.collection
    )
  }

  static countFollowers(userId: string){
    return this.countModels({ "followingTo._id" : userId }, this.collection)
  }

  static countFollowing(userId: string){
    return this.countModels({ "follower._id" : userId }, this.collection)
  }

  static getSpecificFields(followId: string, project: object){
    return this._getSpecificFields({ _id: new ObjectID(followId) }, project, this.collection)
  }
}