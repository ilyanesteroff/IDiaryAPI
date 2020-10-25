"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class Todo extends Model_1.default {
    constructor(todo) {
        super('Todos', Object.assign(Object.assign({}, todo), { createdAt: new Date() }));
    }
    static updateTodo(todoId, data) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(todoId), data, this.collection);
    }
    static updateCreatorName(creatorId, newUsername) {
        return this.updateManyModels({ "creator._id": creatorId }, { $set: { "creator.username": newUsername } }, this.collection);
    }
    static updateCreatorPrivacy(creatorId, privacy) {
        return this.updateManyModels({ "creator._id": creatorId }, { $set: { "creator.public": privacy } }, this.collection);
    }
    static getSpecificFields(query, project) {
        return this._getSpecificFields(query, project, this.collection);
    }
    static findManyTodos(query, currentPage, limit) {
        return this.getManyModels(query, this.collection, { createdAt: -1 }, currentPage, limit);
    }
    static countTodos(query) {
        return this.countModels(query, this.collection);
    }
    static deleteTodo(id) {
        return this.deleteModel(new mongodb_1.ObjectID(id), this.collection);
    }
    static deleteTodosOfDeletedUser(userId) {
        return this.deleteManyModels({ "creator._id": userId }, this.collection);
    }
}
exports.Todo = Todo;
Todo.collection = 'Todos';
