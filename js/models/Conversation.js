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
        this.parcicipants = convInfo.participants;
        this.messages = convInfo.messages;
    }
    save() {
        return db_connection_1.getDb().collection('Conversations')
            .insertOne(this);
    }
    static findConversation(query) {
        return db_connection_1.getDb().collection('Conversations')
            .findOne(query);
    }
    static findManyConversationsForOneUser(userId) {
        return db_connection_1.getDb().collection('Convarsations')
            .find({
            $elemMatch: {
                participants: {
                    id: new mongodb_1.default.ObjectID(userId)
                }
            }
        })
            .toArray();
    }
    static findDialogue(user1Id, user2Id) {
        return db_connection_1.getDb().collection('Conversations')
            //because there can be only one dialogue between only 2 users 
            .findOne({
            participants: {
                $elemMatch: {
                    $and: [
                        { _id: new mongodb_1.default.ObjectID(user1Id) },
                        { _id: new mongodb_1.default.ObjectID(user2Id) }
                    ]
                }
            }
        });
    }
    static addMassage(conversationId, message) {
        return db_connection_1.getDb().collection('Conversations')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(conversationId) }, {
            $push: {
                messages: message
            }
        });
    }
    static deleteMessageForAll(conversationId, messageId) {
        return db_connection_1.getDb().collection('Conversations')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(conversationId) }, {
            $pull: {
                messages: {
                    id: messageId
                }
            }
        });
    }
}
exports.Conversation = Conversation;
