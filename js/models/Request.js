"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Request extends Model_1.default {
    constructor(requestInfo) {
        super('Requests', requestInfo);
    }
    static findRequestFrom(userId, username) {
        return this.getModel({
            "sender.username": username,
            "receiver._id": userId
        }, this.collection);
    }
    static findRequestsTo(userId, username) {
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
    static updateReceiverForMAnyRequests(receiverId, receiver) {
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
exports.default = Request;
Request.collection = 'Requests';
