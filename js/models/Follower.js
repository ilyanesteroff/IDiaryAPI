"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follower = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Follower extends Model_1.default {
    constructor(followingData) {
        super('Followers', followingData);
    }
    static findFollower(userId, username) {
        return this.getModel({
            "follower.username": username,
            "followingTo._id": userId
        }, this.collection);
    }
    static findFollowing(userId, username) {
        return this.getModel({
            "followingTo.username": username,
            "follower._id": userId
        }, this.collection);
    }
    static findManyFollowers(userId, currentPage, limit) {
        return this.getManyModels({ "follower._id": userId }, this.collection, { "followingTo.username": -1 }, currentPage, limit);
    }
    static findManyFollowings(userId, currentPage, limit) {
        return this.getManyModels({ "followingTo._id": userId }, this.collection, { "follower.username": -1 }, currentPage, limit);
    }
    static updateFollower(followerId, newFollower) {
        return this.updateManyModels({ "follower._id": followerId }, {
            $set: {
                follower: newFollower
            }
        }, this.collection);
    }
    static updateFollowing(followingId, newFollowing) {
        return this.updateManyModels({ "followingTo._id": followingId }, {
            $set: {
                followingTo: newFollowing
            }
        }, this.collection);
    }
    static unfollowOrRemoveFollower(followId) {
        return this.deleteModel(new mongodb_1.ObjectID(followId), this.collection);
    }
    static deleteFollowersAndFollowings(userId) {
        return this.deleteManyModels({
            $or: [
                { "followingTo._id": userId }, { "follower._id": userId }
            ]
        }, this.collection);
    }
    static handleUserBlocking(user1Id, user2Id) {
        return this.deleteManyModels({
            $or: [
                { "followingTo._id": user1Id, "follower._id": user2Id },
                { "followingTo._id": user2Id, "follower._id": user1Id }
            ]
        }, this.collection);
    }
    static countFollowers(userId) {
        return this.countModels({ "followingTo._id": userId }, this.collection);
    }
    static countFollowing(userId) {
        return this.countModels({ "followers._id": userId }, this.collection);
    }
    static getSpecificFields(followId, project) {
        return this._getSpecificFields({ _id: new mongodb_1.ObjectID(followId) }, project, this.collection);
    }
}
exports.Follower = Follower;
Follower.collection = 'Followers';
