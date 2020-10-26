const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')
const { User } = require('../js/models/User')


exports.auth = async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if(authHeader) {
    try {
      const token = authHeader.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findUser({ _id: new ObjectID(decodedToken.userId)})
      if(user) {
        req.user = user
        req.user._id = req.user._id.toString()
      }
    } catch {} 
    finally {
      next()
    }
  } else next() 
}

exports.cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  req.method === 'OPTIONS'
    ? res.sendStatus(200)
    : next()
}