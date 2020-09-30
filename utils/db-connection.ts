import mongo from 'mongodb'
const MongoClient = mongo.MongoClient
let _db: mongo.Db

const client = new  MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@firstcluster.hazg0.mongodb.net/${process.env.DB}`, 
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