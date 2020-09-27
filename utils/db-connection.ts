import mongo from 'mongodb'
import { dbvars } from './variables'
const MongoClient = mongo.MongoClient
let _db: mongo.Db

const client = new  MongoClient(
  `mongodb+srv://${dbvars.username}:${dbvars.password}@firstcluster.hazg0.mongodb.net/${dbvars.db}`, 
  { useUnifiedTopology: true }
)

export const mongoConnect = (cb: Function) => {
  client.connect()
    .then(client => {
      _db = client.db()
      cb()
    })
    .catch(err => {
      throw err
    })
}

export const getDb = () => {
  if(_db){
    return _db
  }
  throw 'Database not found'
}