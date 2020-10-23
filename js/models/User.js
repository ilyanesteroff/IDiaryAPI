"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class User extends Model_1.default {
    constructor(userInfo) {
        super('Users', Object.assign(Object.assign({}, userInfo), { createdAt: new Date() }));
    }
    static updateUser(userId, data) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(userId), data, this.collection);
    }
    static deleteUser(userId) {
        return this.deleteModel(new mongodb_1.ObjectID(userId), this.collection);
    }
    static findUser(query) {
        return this.getModel(query, this.collection);
    }
    static getSpecificFields(query, project) {
        return this._getSpecificFields(query, project, this.collection);
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
