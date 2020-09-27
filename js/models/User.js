"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const db_connection_1 = require("../utils/db-connection");
class User {
    constructor(userInfo) {
        this.username = userInfo.username;
        this.firstname = userInfo.firstname;
        this.lastname = userInfo.lastname;
        this.email = userInfo.email;
        this.dialogues = [];
        this.followers = [];
        this.following = [];
        this.FullfilledTodos = 0;
        this.ActiveTodos = 0;
        this.password = userInfo.password;
        this.createdAt = new Date();
        this.approved = false;
        this.requestsTo = [];
        this.requestsFrom = [];
        this.blacklist = [];
        this.public = userInfo.public;
        if (userInfo.phone)
            this.phone = userInfo.phone;
        if (userInfo.website)
            this.website = userInfo.website;
        if (userInfo.company)
            this.company = userInfo.company;
        if (userInfo.about)
            this.about = userInfo.about;
        if (userInfo.relationshipStatus)
            this.relationshipStatus = userInfo.relationshipStatus;
    }
    save() {
        return db_connection_1.getDb().collection('Users').insertOne(this);
    }
    static updateUser(userId, info) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, info);
    }
    static deleteUser(userId) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndDelete({ _id: new mongodb_1.default.ObjectID(userId) });
    }
    static getUser(username) {
        return db_connection_1.getDb().collection('Users')
            .findOne({ username: username });
    }
    static findUser(query) {
        return db_connection_1.getDb().collection('Users')
            .findOne(query);
    }
    //can be used for sending messages, todos and requests
    static pushSomething(userId, fieldName, fieldValue) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, { $push: {
                [fieldName]: fieldValue
            }
        });
    }
    //
    static pullSomething(userId, fieldName, query) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, {
            $pull: {
                [fieldName]: query
            }
        });
    }
    static setResetPasswordToken(userId, token) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, {
            $set: {
                resetPassword: {
                    token: token,
                    bestBefore: new Date().getTime() + 7400000
                }
            }
        });
    }
    static getSpecificField(userId, params) {
        return db_connection_1.getDb().collection('Users')
            .findOne({ _id: new mongodb_1.default.ObjectID(userId) }, params);
    }
    static formatUserAsFollower(user) {
        return {
            _id: user._id ? user._id.toString() : undefined,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        };
    }
}
exports.User = User;
