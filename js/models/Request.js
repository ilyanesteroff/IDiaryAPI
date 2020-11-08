"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Request extends Model_1.default {
    constructor(requestInfo) {
        super('Requests', requestInfo);
    }
    static findRequestById(reqId) {
        return this.getModel({ _id: new mongodb_1.ObjectID(reqId) }, this.collection);
    }
    static getSpecificFields(reqId, project) {
        return this._getSpecificFields({ _id: new mongodb_1.ObjectID(reqId) }, project, this.collection);
    }
    static findRequestFrom(userId, username) {
        return this.getModel({
            "sender.username": username,
            "receiver._id": userId
        }, this.collection);
    }
    static findRequestTo(userId, username) {
        return this.getModel({
            "receiver.username": username,
            "sender._id": userId
        }, this.collection);
    }
    static findManyRequestForReceiver(receiverId, currentPage, limit) {
        return this.getManyModels({ "receiver._id": receiverId }, this.collection, { createdAt: -1 }, currentPage, limit);
    }
    static findManyRequestForSender(senderId, currentPage, limit) {
        return this.getManyModels({ "sender._id": senderId }, this.collection, { createdAt: -1 }, currentPage, limit);
    }
    static deleteRequest(id) {
        return this.deleteModel(new mongodb_1.ObjectID(id), this.collection);
    }
    static deleteAllRequestsForSender(senderId) {
        return this.deleteManyModels({ "sender._id": senderId }, this.collection);
    }
    static handleUserBlocking(user1Id, user2Id) {
        return this.deleteManyModels({
            $or: [
                { "sender._id": user1Id, "receiver._id": user2Id },
                { "sender._id": user2Id, "receiver._id": user1Id }
            ]
        }, this.collection);
    }
    static deleteAllRequestsForReceiver(receiverId) {
        return this.deleteManyModels({ "receiver._id": receiverId }, this.collection);
    }
    static updateSenderForManyRequests(senderId, sender) {
        return this.updateManyModels({ "sender._id": senderId }, {
            $set: {
                sender: sender
            }
        }, this.collection);
    }
    static updateReceiverForManyRequests(receiverId, receiver) {
        return this.updateManyModels({ "sender._id": receiverId }, {
            $set: {
                receiver: receiver
            }
        }, this.collection);
    }
    static countIncomingRequests(userId) {
        return this.countModels({ "receiver._id": userId }, this.collection);
    }
    static countOutcomingRequests(userId) {
        return this.countModels({ "sender._id": userId }, this.collection);
    }
}
exports.Request = Request;
Request.collection = 'Requests';
