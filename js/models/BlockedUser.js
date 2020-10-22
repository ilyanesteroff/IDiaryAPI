"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedUser = void 0;
const Model_1 = __importDefault(require("./Model"));
class BlockedUser extends Model_1.default {
    constructor(blockInfo) {
        super('BlockedUsers', blockInfo);
    }
    static findById(userId, blockedUserId) {
        return this.getModel({
            "blockedUser._id": blockedUserId,
            userWhoBlocked: userId
        }, this.collection);
    }
    static findByUsername(userId, username) {
        return this.getModel({
            "blockedUser.username": username,
            userWhoBlocked: userId
        }, this.collection);
    }
    static findManyBlockedUsers(userId, currentPage, limit) {
        return this.getManyModels({ userWhoBlocked: userId }, this.collection, { "blockedUser.username": -1 }, currentPage, limit);
    }
    static updateBlockedUsers(userId, blockedUser, changed) {
        return this.updateManyModels({
            "blockedUser.username": blockedUser,
            userWhoBlocked: userId
        }, {
            $set: {
                blockedUser: changed
            }
        }, this.collection);
    }
    static countBlockedUsers(userId) {
        return this.countModels({ userWhoBlocked: userId }, this.collection);
    }
    static unblock(userId, userWhomToUnblock) {
        return this.deleteManyModels({
            userWhoBlocked: userId,
            "blockedUser.username": userWhomToUnblock
        }, this.collection);
    }
    static deleteBlocked(userId) {
        return this.deleteManyModels({
            userWhoBlocked: userId
        }, this.collection);
    }
}
exports.BlockedUser = BlockedUser;
BlockedUser.collection = 'BlockedUsers';
