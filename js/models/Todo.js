"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const db_connection_1 = require("./../utils/db-connection");
class Todo {
    constructor(todo) {
        this.creator = todo.creator;
        this.task = todo.task;
        this.completed = todo.completed;
        this.createdAt = new Date();
        if (todo.timeToComplete)
            this.timeToComplete = todo.timeToComplete;
        this.public = todo.public;
        if (todo.tags)
            this.tags = todo.tags;
    }
    save() {
        return db_connection_1.getDb().collection('Todos').insertOne(this);
    }
    static updateTodo(todoId, info) {
        return db_connection_1.getDb().collection('Todos')
            .findOneAndUpdate({ _id: new mongodb_1.default.ObjectID(todoId) }, info);
    }
    //findOne
    static findOneTodo(query) {
        return db_connection_1.getDb().collection('Todos')
            .findOne(query);
    }
    static findManyTodos(query, currentPage, limit) {
        return db_connection_1.getDb().collection('Todos')
            .find(query)
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .toArray();
    }
    static countTodos(query) {
        return db_connection_1.getDb().collection('Todos')
            .count(query);
    }
    static deleteTodo(todoId) {
        return db_connection_1.getDb().collection('Todos')
            .deleteOne({ _id: new mongodb_1.default.ObjectID(todoId) });
    }
    static deleteTodosOfDeletedUser(userId) {
        return db_connection_1.getDb().collection('Todos')
            .deleteMany({ "creator._id": userId });
    }
}
exports.Todo = Todo;
