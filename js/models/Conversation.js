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
        super('Conversations', Object.assign(Object.assign({}, convInfo), { unseenMessages: 0 }));
    }
    static getConversation(convId) {
        return this.getModel({ _id: new mongodb_1.ObjectID(convId) }, this.collection);
    }
    static getSpecificFields(convId, project) {
        return this._getSpecificFields({ _id: new mongodb_1.ObjectID(convId) }, project, this.collection);
    }
    static getConversationByUserneme(username, user1Id) {
        return this.getModel({
            $and: [
                { "participants": { $elemMatch: { _id: user1Id } } },
                { "participants": { $elemMatch: { username: username } } }
            ]
        }, this.collection);
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
    static increaseUnseenMessages(convId) {
        return this.updateModel(new mongodb_1.ObjectID(convId), { $inc: { unseenMessages: 1 } }, this.collection)
            .then(_ => {
            return this.getConversation(convId);
        });
    }
    static decreaseUnseenMessages(convId) {
        return this.updateModel(new mongodb_1.ObjectID(convId), { $inc: { unseenMessages: -1 } }, this.collection)
            .then(_ => {
            return this.getConversation(convId);
        });
    }
    static unsetUnseenMessages(convId) {
        return this.updateModel(new mongodb_1.ObjectID(convId), { $set: { unseenMessages: 0 } }, this.collection);
    }
    static updateUserInManyConversations(userId, newUser) {
        return this.updateManyModels({ "participants._id": userId }, { $set: { "participants.$": newUser } }, this.collection);
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
    static deleteConversations(userId) {
        return this.deleteManyModels({
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
