const mongo = require('mongodb')
const { dbvars } = require('./variables')
const MongoClient = mongo.MongoClient
let _db

const client = new MongoClient(
  `mongodb+srv://${dbvars.username}:${dbvars.password}@firstcluster.hazg0.mongodb.net/${dbvars.db}`, 
  { useUnifiedTopology: true }
)

const mongoConnect = cb => {
  client.connect()
    .then(client => {
      _db = client.db()
      cb()
    })
    .catch(err => {
      throw err
    })
}

const getDb = () => {
  if(_db){
    return _db
  }
  throw 'Database not found'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb