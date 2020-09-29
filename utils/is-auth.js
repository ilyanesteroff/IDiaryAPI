const mongo = require('mongodb')
const {User} = require('../js/models/User')

exports.auth = async (req, res, next) => {
  //check for token in the future
  const user = await User.findUser({ _id: new mongo.ObjectID('5f73790e42b796385caab375')})
  if(user) {
    req.isAuth = true
    req.user = user
    req.user._id = req.user._id.toString()
  }
  next()
}

exports.cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  req.method === 'OPTIONS'
    ? res.sendStatus(200)
    : next()
}