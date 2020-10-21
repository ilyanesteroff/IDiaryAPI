import DbModel from './Model'
import { IBlock, follower } from './model-types'

export default class BlockedUser extends DbModel{
  static collection: string = 'BlockedUsers'
  constructor(blockInfo: IBlock){
    super('BlockedUsers', blockInfo)
  }

  static findBlockedUser(userId: string, username: string){
    return this.getModel(
      { 
        "blockedUser.username" : username,
        userWhoBlocked : userId                         
      }, 
      this.collection
    )
  }

  static findManyBlockedUsers(userId: string, currentPage: number, limit: number){
    return this.getManyModels(
      { userWhoBlocked : userId }, 
      this.collection, 
      {"blockedUser.username": -1},
      currentPage,
      limit
    )
  }

  static updateBlockedUsers(userId: string, blockedUser: string, changed: follower){
    return this.updateManyModels(
      { 
        "blockedUser.username" : blockedUser,
        userWhoBlocked: userId 
      }, 
      {
        $set: {
          blockedUser : changed
        }
      }, 
      this.collection)
  }

  static countBlockedUsers(userId: string){
    return this.countModels({ userWhoBlocked : userId }, this.collection)
  }

  static unblock(userId: string, userWhomToUnblock: string){
    return this.deleteManyModels({
      userWhoBlocked : userId,
      "blockedUser.username" : userWhomToUnblock
    }, this.collection)
  }

  static deleteBlocked(userId: string){
    return this.deleteManyModels({
      userWhoBlocked: userId
    }, this.collection)
  }
}

