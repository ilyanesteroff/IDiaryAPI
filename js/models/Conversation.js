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
    static getSpecificFields(convId, project) {
        return this._getSpecificFields({ _id: new mongodb_1.ObjectID(convId) }, project, this.collection);
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
    static setAnotherLatestMessage(id, message, updatedAt) {
        return this.updateModel(new mongodb_1.ObjectID(id), {
            $set: {
                latestMessage: message,
                updatedAt: updatedAt || new Date()
            }
        }, this.collection);
    }
    //mb remove this
    static updateManyConversations(query, data) {
        return this.updateManyModels(query, data, this.collection);
    }
    static updateUserInManyConversations(userId, newUser) {
        return this.updateManyConversations({ "participants._id": userId }, { $set: { "participants.$": newUser } });
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
