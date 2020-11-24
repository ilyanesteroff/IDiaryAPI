"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Message extends Model_1.default {
    constructor(messageInfo) {
        super('Messages', Object.assign(Object.assign({}, messageInfo), { writtenAt: new Date(), seen: false }));
    }
    static viewMessages(convId, to) {
        return this.updateManyModels({
            conversationID: convId,
            seen: false,
            to: to
        }, { $set: { seen: true } }, this.collection);
    }
    static getSpecificFields(messageId, project) {
        return this._getSpecificFields({ _id: new mongodb_1.ObjectID(messageId) }, project, this.collection);
    }
    static findManyMessages(query, currentPage, limit) {
        return this.getManyModels(query, this.collection, { writtenAt: 1 }, currentPage, limit);
    }
    static changeMessageText(messageId, text) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(messageId), {
            $set: {
                text: text
            }
        }, this.collection);
    }
    static updateAuthorInManyMassages(oldName, newName) {
        return this.updateManyModels({ author: oldName }, { $set: { author: newName } }, this.collection);
    }
    static updateManyMessages(query, data) {
        return this.updateManyModels(query, data, this.collection);
    }
    static deleteMessage(messageId) {
        return this.deleteModel(new mongodb_1.ObjectID(messageId), this.collection);
    }
    static toggleLikeMessage(messageId, like) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(messageId), {
            $set: {
                liked: like
            }
        }, this.collection);
    }
    static deleteManyMessages(userId, username) {
        return this.deleteManyModels({
            $or: [
                { to: userId },
                { author: username }
            ]
        }, this.collection);
    }
    static getLatestMessage(convId) {
        return this.getManyModels({
            conversationID: convId,
        }, this.collection, { writtenAt: -1 }, 1, 1)
            .then(res => res[0]);
    }
    static countMessages(convID) {
        return this.countModels({ conversationID: convID }, this.collection);
    }
    static countUnseenMessages(userId) {
        return this.countModels({ seen: false, to: userId }, this.collection);
    }
}
exports.Message = Message;
Message.collection = 'Messages';
