"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
const db_connection_1 = require("../utils/db-connection");
class User extends Model_1.default {
    constructor(userInfo) {
        super('Users', Object.assign(Object.assign({}, userInfo), { FullfilledTodos: 0, ActiveTodos: 0, createdAt: new Date() }));
    }
    static updateUser(userId, info) {
        return Model_1.default.updateModel(new mongodb_1.ObjectID(userId), info, this.collection);
    }
    static deleteUser(userId) {
        return Model_1.default.deleteModel(new mongodb_1.ObjectID(userId), this.collection);
    }
    static findUser(query) {
        return Model_1.default.getModel(query, this.collection);
    }
    static getSpecificFields(query, project) {
        return db_connection_1.getDb().collection(this.collection)
            .aggregate([
            { $match: query },
            { $project: project }
        ])
            .toArray()
            .catch(err => err);
    }
    static formatUserAsFollower(user) {
        return {
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        };
    }
}
exports.User = User;
User.collection = 'Users';
