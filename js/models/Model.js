"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const db_connection_1 = require("../utils/db-connection");
class DbModel {
    constructor(collection, data) {
        this.collection = collection;
        this.data = data;
    }
    save() {
        return db_connection_1.getDb().collection(this.collection)
            .insertOne(this.data)
            .then(res => {
            return Object.assign(Object.assign({}, res.ops[0]), { _id: res.ops[0]._id.toString() });
        })
            .catch(err => err);
    }
    static updateModel(id, data, collection) {
        return db_connection_1.getDb().collection(collection)
            .findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, data)
            .catch(err => err);
    }
    static updateAndReturnModel(id, data, collection) {
        return db_connection_1.getDb().collection(collection)
            .findOneAndUpdate({ _id: new mongodb_1.ObjectID(id) }, data)
            .then(_ => db_connection_1.getDb().collection(collection).findOne({ _id: new mongodb_1.ObjectID(id) }))
            .catch(err => err);
    }
    static updateManyModels(query, data, collection) {
        return db_connection_1.getDb().collection(collection)
            .updateMany(query, data)
            .catch(err => err);
    }
    static deleteModel(id, collection) {
        return db_connection_1.getDb().collection(collection)
            .findOneAndDelete({ _id: new mongodb_1.ObjectID(id) })
            .catch(err => err);
    }
    static deleteManyModels(query, collection) {
        return db_connection_1.getDb().collection(collection)
            .deleteMany(query)
            .catch(err => err);
    }
    static getModel(query, collection) {
        return db_connection_1.getDb().collection(collection)
            .findOne(query)
            .catch(err => err);
    }
    static getManyModels(query, collection, sortQuery, currentPage, limit) {
        return db_connection_1.getDb().collection(collection)
            .find(query)
            .sort(sortQuery)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .toArray()
            .catch(err => err);
    }
    static countModels(query, collection) {
        return db_connection_1.getDb().collection(collection)
            .countDocuments(query)
            .catch(err => err);
    }
}
exports.default = DbModel;
