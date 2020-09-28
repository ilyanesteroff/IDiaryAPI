const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {throwAnError} = require('../../utils/error-handlers')


exports.sendFollowRequest = async function(to, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user._id === to) return false
  const requestSender = req.user
  const requestReceiver = (await User.getSpecificFields({ _id: new mongo.ObjectID(to)}, { 
    followers: 1, username: 1,
    blacklist: 1, firstname: 1,
    requestsFrom: 1, lastname: 1
  }))[0]
  if(!requestReceiver) throwAnError('Receiver does not exist', 404)
  if(
    requestReceiver.followers.some(f => f._id === requestSender._id) ||
    requestSender.following.some(f => f._id === to) ||
    requestReceiver.blacklist.some(f => f._id === requestSender._id) ||
    requestSender.blacklist.some(f => f._id === to)
  ) return false
  if(!requestReceiver.requestsFrom.some(r => r._id === requestSender._id))
    await User.pushSomething(to, 'requestsFrom', User.formatUserAsFollower(requestSender))
  if(!requestSender.requestsTo.some(r => r._id === to))
    await User.pushSomething(requestSender._id, 'requestsTo', User.formatUserAsFollower(requestReceiver))
  return true
}

exports.unsendFollowRequest = async function(to, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user._id === to) return false
  const requestSender = req.user
  const requestReceiver = (await User.getSpecificFields({_id: new mongo.ObjectID(to)}, {_id: 1}))[0]
  if(!requestReceiver) throwAnError('Receiver does not exist', 404)
  await User.pullSomething(requestSender._id, 'requestsTo', { _id: to })
  await User.pullSomething(to, 'requestsFrom', { _id: requestSender._id })
  return true
}

exports.rejectFollowRequest = async function(from, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user._id === from) return false
  const requestReceiver = req.user
  const requestSender = (await User.getSpecificFields({ _id: new mongo.ObjectID(from)}, {requestsTo: 1}))[0]
  if(!requestSender) throwAnError('Request sender not found', 404)
  if(
    !requestReceiver.requestsFrom.some(r => r._id === from) &&
    !requestSender.requestsTo.some(r => r._id === requestReceiver._id)
  ) return false
  await User.pullSomething(requestReceiver._id, 'requestsFrom', { _id: from })
  await User.pullSomething(from, 'requestsTo', { _id: requestReceiver._id })
  return true
}

exports.acceptFollower = async function(followerId, req) {
  if(!req.user) throwAnError('Authorization failed', 400)
  if(followerId === req.user._id) return false
  const requestSender = (await User.getSpecificFields({ _id: new mongo.ObjectID(followerId)}, {
    requestsTo: 1, following: 1, username: 1, lastname: 1, firstname: 1
  }))[0]
  if(!requestSender) throwAnError('follower not found', 404)
  const requestReceiver = req.user
  if(
    !requestReceiver.requestsFrom.some(r => r._id === followerId) ||
    !requestSender.requestsTo.some(r => r._id === requestReceiver._id)
  ) return false

  const newFollowerInFollowers = requestReceiver.followers.some(f => f._id === followerId)
  //checks whether user who send a following request is already in followers list
  if(!newFollowerInFollowers) {
    await User.pullSomething(requestReceiver._id, 'requestsFrom', { _id: followerId })
    await User.pushSomething(requestReceiver._id, 'followers', User.formatUserAsFollower(requestSender))
  }
  const ifUserInFollowing = requestSender.following.some(f => f._id === requestReceiver._id)
  //Checks whether user who send a request already has a user in following list
  if(!ifUserInFollowing){
    await User.pullSomething(followerId, 'requestsTo', { _id: requestReceiver._id })
    await User.pushSomething(followerId, 'following', User.formatUserAsFollower(requestReceiver))
  }
  return true
}

exports.unfollow = async function(userId, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user._id === userId) return false
  const user = req.user
  const userToUnfollow = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId) }, { followers: 1 }))[0]
  if(!userToUnfollow) throwAnError('User not found', 404)
  if(
    !user.following.some(f => f._id === userId) &&
    !userToUnfollow.followers.some(f => f._id === user._id) 
  ) return false
  await User.pullSomething(user._id, 'following', {
    _id : userId
  })
  await User.pullSomething(userId, 'followers', {
    _id: user._id
  })
  return true
}