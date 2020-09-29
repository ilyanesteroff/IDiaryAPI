"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const db_connection_1 = require("../utils/db-connection");
class Conversation {
    constructor(convInfo) {
        this.participants = convInfo.participants;
        this.messages = convInfo.messages;
    }
    save() {
        return db_connection_1.getDb().collection('Conversations')
            .insertOne(this)
            .catch(err => err);
    }
    static findConversation(query) {
        return db_connection_1.getDb().collection('Conversations')
            .findOne(query)
            .catch(err => err);
    }
    static destroyConversation(query) {
        return db_connection_1.getDb().collection('Conversations')
            .deleteOne(query)
            .catch(err => err);
    }
    static findDialogue(participants) {
        return db_connection_1.getDb().collection('Conversations')
            //because there can be only one dialogue between only 2 users 
            .findOne({
            participants: participants
        })
            .catch(err => err);
    }
    static addMassage(conversationId, message) {
        return db_connection_1.getDb().collection('Conversations')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(conversationId) }, {
            $push: {
                messages: message
            }
        })
            .then(_ => {
            return db_connection_1.getDb().collection('Conversations')
                .findOne({ _id: new mongodb_1.default.ObjectID(conversationId) });
        })
            .catch(err => err);
    }
    static updateMessage(convId, messageId, text) {
        return db_connection_1.getDb().collection('Conversations')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(convId), messages: { $elemMatch: { id: messageId } } }, { $set: { "messages.$.text": text } })
            .then(_ => {
            return db_connection_1.getDb().collection('Conversations')
                .findOne({ _id: new mongodb_1.default.ObjectID(convId) });
        })
            .catch(err => err);
    }
    static deleteMessageForAll(conversationId, messageId) {
        return db_connection_1.getDb().collection('Conversations')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(conversationId) }, {
            $pull: {
                messages: {
                    id: messageId
                }
            }
        })
            .then(_ => {
            return db_connection_1.getDb().collection('Conversations')
                .findOne({ _id: new mongodb_1.default.ObjectID(conversationId) });
        })
            .catch(err => err);
    }
    static formatAsDialogue(conv) {
        return {
            _id: conv._id ? conv._id.toString() : undefined,
            participants: conv.participants,
            latestMessage: {
                id: conv.messages[conv.messages.length - 1].id,
                writtenAt: conv.messages[conv.messages.length - 1].writtenAt,
                text: conv.messages[conv.messages.length - 1].text,
                author: conv.messages[conv.messages.length - 1].author
            }
        };
    }
}
exports.Conversation = Conversation;
