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
        this.approveEmailToken = userInfo.approveEmailToken;
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
        return db_connection_1.getDb().collection('Users').insertOne(this).catch(err => err);
    }
    static updateUser(userId, info) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, info)
            .catch(err => err);
    }
    static deleteUser(userId) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndDelete({ _id: new mongodb_1.default.ObjectID(userId) })
            .catch(err => err);
    }
    //in future get rid of this
    static getUser(username) {
        return db_connection_1.getDb().collection('Users')
            .findOne({ username: username })
            .catch(err => err);
    }
    static findUser(query) {
        return db_connection_1.getDb().collection('Users')
            .findOne(query)
            .catch(err => err);
    }
    //can be used for sending messages, todos and requests
    static pushSomething(userId, fieldName, fieldValue) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, { $push: {
                [fieldName]: fieldValue
            }
        })
            .catch(err => err);
    }
    //
    static pullSomething(userId, fieldName, query) {
        return db_connection_1.getDb().collection('Users')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(userId) }, {
            $pull: {
                [fieldName]: query
            }
        })
            .catch(err => err);
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
        })
            .catch(err => err);
    }
    static getSpecificFields(query, project) {
        return db_connection_1.getDb().collection('Users')
            .aggregate([
            { $match: query },
            { $project: project }
        ])
            .toArray()
            .catch(err => err);
    }
    static formatUserAsFollower(user) {
        return {
            _id: user._id ? user._id.toString() : undefined,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        };
    }
    static updateDialogues(dialogue) {
        return db_connection_1.getDb().collection('Users').updateMany({ dialogues: { $elemMatch: { _id: dialogue._id } } }, { $set: { "dialogues.$.latestMessage": dialogue.latestMessage } })
            .catch(err => err);
    }
    static deleteDialogues(id) {
        return db_connection_1.getDb().collection('Users').updateMany({ dialogues: { $elemMatch: { _id: id } } }, { $pull: { dialogues: { _id: id } } });
    }
    static deleteRequestsOfDeletedUser(userId, fieldName) {
        return db_connection_1.getDb().collection('Users')
            .updateMany({ [fieldName]: { $elemMatch: { _id: userId } } }, { $pull: { [fieldName]: { _id: userId } } })
            .catch(err => err);
    }
}
exports.User = User;
