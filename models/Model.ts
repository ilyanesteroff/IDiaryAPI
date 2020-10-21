import { ObjectID } from 'mongodb'
import { getDb } from '../utils/db-connection'

export default class DbModel{
  collection: string
  data: object
  
  constructor(collection: string, data: object){
    this.collection = collection
    this.data = data
  }

  save() {
    return getDb().collection(this.collection)
      .insertOne(this.data)
      .then(res => {
        return {
          ...res.ops[0],
          _id: res.ops[0]._id.toString()
        }
      })
      .catch(err => err)
  }

  protected static updateModel(id: ObjectID, data: object, collection: string){
    return getDb().collection(collection)
      .findOneAndUpdate({ _id: new ObjectID(id)}, data)
      .catch(err => err)
  }

  protected static updateAndReturnModel(id: ObjectID, data: object, collection: string){
    return getDb().collection(collection)
      .findOneAndUpdate({ _id: new ObjectID(id)}, data)
      .then(_ => getDb().collection(collection).findOne({ _id: new ObjectID(id)}))
      .catch(err => err) 
  }

  protected static updateManyModels(query: object, data: object, collection: string){
    return getDb().collection(collection)
      .updateMany(query, data)
      .catch(err => err)
  }

  protected static deleteModel(id: ObjectID, collection: string){
    return getDb().collection(collection)
      .findOneAndDelete({ _id : new ObjectID(id)})
      .catch(err => err)
  }

  protected static deleteManyModels(query: object, collection: string){
    return getDb().collection(collection)
      .deleteMany(query)
      .catch(err => err)
  }

  protected static getModel(query: object, collection: string){
    return getDb().collection(collection)
      .findOne(query)
      .catch(err => err)
  }

  protected static getManyModels(query: object, collection: string, sortQuery: object, currentPage: number, limit: number){
    return getDb().collection(collection)
      .find(query)
      .sort(sortQuery)
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .toArray()
      .catch(err => err)
  }

  protected static countModels(query: object, collection: string){
    return getDb().collection(collection)
      .countDocuments(query)
      .catch(err => err)
  }
}