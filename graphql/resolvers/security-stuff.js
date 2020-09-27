const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {throwAnError} = require('../../utils/error-handlers')

exports.blockUser = async function(userId, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  if(req.user._id === userId) return false
  const user = req.user
  const userToBlock = await User.findUser({ _id: new mongo.ObjectID(userId)})
  if(!userToBlock) throwAnError('User you want to block not found', 404)
  if(user.blacklist.some(u => u._id === userId)) return false
  await User.pullSomething(user._id, 'requestsTo', { _id: userId })
  await User.pullSomething(user._id, 'requestsFrom', { _id: userId })
  await User.pullSomething(user._id, 'following', { _id: userId })
  await User.pullSomething(user._id, 'followers', { _id: userId })
  await User.pullSomething(userId, 'requestsTo', { _id: user._id })
  await User.pullSomething(userId, 'requestsFrom', { _id: user._id })
  await User.pullSomething(userId, 'following', { _id: user._id })
  await User.pullSomething(userId, 'followers', { _id: user._id })

  await User.pushSomething(user._id, 'blacklist', User.formatUserAsFollower(userToBlock))
  return true
}

exports.unblockUser = async function(userId, req){
  try{
    if(!req.user) throwAnError('Authorization failed', 400)
    if(req.user._id === userId) return false
    const user = req.user
    if(!user.blacklist.some(u => u._id === userId)) return false
    const userToUnblock = await User.findUser({ _id: new mongo.ObjectID(userId) })
    if(!userToUnblock) throwAnError('User to unblock is not found', 404)
    await User.pullSomething(user._id, 'blacklist', { _id: userId })
    return true
  } catch(err){
    //in case if something went wrong e.g. db does not respond
    console.log(err.message)
    return false
  }
}

exports.isAbleToContact = async function(userId, req){
  try {
    if(!req.user) return false 
    if(req.user._id === userId) return true
    const userThatWantsContact = req.user
    if(userThatWantsContact.blacklist.some(u => u._id === userId)) throwAnError('Cannot contact blocked user', 422)
    const userToContact = await User.findUser({ _id : new mongo.ObjectID(userId)})
    if(!userToContact) return false
    if(userToContact.blacklist.some(u => u._id === userThatWantsContact._id)) throwAnError('Cannot contact user', 422)
    if(userToContact.public) return true
    return !userToContact.public && userToContact.followers.some(f => f._id === userThatWantsContact._id) && userToContact.following.some(f => f._id === userThatWantsContact._id)
      ? true
      : false    
  } catch (err) {
    return false
  }
}