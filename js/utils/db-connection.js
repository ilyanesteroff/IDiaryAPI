"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.mongoConnect = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const variables_1 = require("./variables");
const MongoClient = mongodb_1.default.MongoClient;
let _db;
const client = new MongoClient(`mongodb+srv://${variables_1.dbvars.username}:${variables_1.dbvars.password}@firstcluster.hazg0.mongodb.net/${variables_1.dbvars.db}`, { useUnifiedTopology: true });
exports.mongoConnect = (cb) => {
    client.connect()
        .then(client => {
        _db = client.db();
        cb();
    })
        .catch(err => {
        throw err;
    });
};
exports.getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'Database not found';
};
