"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class UserSettings extends Model_1.default {
    constructor(userInfo) {
        super('UserInfo', userInfo);
    }
    static deleteUserInfo(id) {
        return this.deleteModel(new mongodb_1.ObjectID(id), this.collection);
    }
    static updateUserInfo(id, data) {
        return this.updateModel(new mongodb_1.ObjectID(id), data, this.collection);
    }
    static getUserInfo(query) {
        return this.getModel(query, this.collection);
    }
    static setResetPasswordToken(userId, token) {
        return this.updateModel(new mongodb_1.ObjectID(userId), {
            $set: {
                resetPassword: {
                    token: token,
                    bestBefore: new Date().getTime() + 7400000
                }
            }
        }, this.collection);
    }
}
exports.default = UserSettings;
UserSettings.collection = 'UserSettings';
