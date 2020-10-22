"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Conversation extends Model_1.default {
    constructor(convInfo) {
        super('Conversations', convInfo);
    }
    static findManyConversationsForOneUser(userId, currentPage, limit) {
        return this.getManyModels({
            participants: {
                $elemMatch: {
                    _id: userId
                }
            }
        }, this.collection, { updatedAt: -1 }, currentPage, limit);
    }
    static destroyConversation(id) {
        return this.deleteModel(new mongodb_1.ObjectID(id), this.collection);
    }
    static setAnotherLatestMessage(id, message) {
        return this.updateModel(new mongodb_1.ObjectID(id), {
            $set: {
                latestMessage: message,
                updatedAt: new Date()
            }
        }, this.collection);
    }
    static updateManyConversations(query, data) {
        return this.updateManyModels(query, data, this.collection);
    }
    static countConversations(userId) {
        return this.countModels({
            participants: {
                $elemMatch: {
                    _id: userId
                }
            }
        }, this.collection);
    }
}
exports.Conversation = Conversation;
Conversation.collection = 'Conversations';
