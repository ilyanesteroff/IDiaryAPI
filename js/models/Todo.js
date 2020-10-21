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
        super('Todos', todo);
    }
    static updateTodo(todoId, data) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(todoId), data, this.collection);
    }
    static updateManyTodos(query, data) {
        return this.updateManyModels(query, data, this.collection);
    }
    static findOneTodo(query) {
        return this.getModel(query, this.collection);
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
