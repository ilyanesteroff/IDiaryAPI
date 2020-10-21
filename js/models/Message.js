"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Message extends Model_1.default {
    constructor(messageInfo) {
        super('Messages', messageInfo);
    }
    static viewMessages(convId) {
        return this.updateManyModels({
            conversationID: new mongodb_1.ObjectID(convId),
            seen: false
        }, { $set: { seen: true } }, this.collection);
    }
    static findManyMessages(query, currentPage, limit) {
        return this.getManyModels(query, this.collection, { createdAt: -1 }, currentPage, limit);
    }
    static changeMessageText(messageId, text) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(messageId), {
            $set: {
                text: text
            }
        }, this.collection);
    }
    static updateManyMessages(query, data) {
        return this.updateManyModels(query, data, this.collection);
    }
    static deleteMessage(messageId) {
        return this.deleteModel(new mongodb_1.ObjectID(messageId), this.collection);
    }
    static likeMessage(messageId) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(messageId), {
            $set: {
                liked: true
            }
        }, this.collection);
    }
    static unlikeMessage(messageId) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(messageId), {
            $set: {
                liked: false
            }
        }, this.collection);
    }
    static getLikedMessages(convId, currentPage, limit) {
        return this.getManyModels({
            conversationID: convId,
            liked: true
        }, this.collection, { createdAt: -1 }, currentPage, limit);
    }
}
exports.default = Message;
Message.collection = 'Messages';
