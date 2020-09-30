"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.mongoConnect = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const MongoClient = mongodb_1.default.MongoClient;
let _db;

const client = new MongoClient(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@firstcluster.hazg0.mongodb.net/${process.env.DB}`, { useUnifiedTopology: true });
exports.mongoConnect = (cb) => {
    client.connect()
        .then(client => {
        _db = client.db();
        cb();
    })
        .catch(err => {
            console.log(process.env.DB_USERNAME)
        throw err;
    });
};
exports.getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'Database not found';
};
