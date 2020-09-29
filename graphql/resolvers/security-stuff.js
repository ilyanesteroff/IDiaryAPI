const mongo = require('mongodb')
const {User} = require('../../js/models/User')
const {throwAnError, checkAndThrowError} = require('../../utils/error-handlers')
const {lists} = require('../assistants/vars')

exports.blockUser = async function(userId, req){
  try {
    if(!req.user) throwAnError('Authorization failed', 400)
    if(req.user._id === userId) return false
    const user = req.user
    const userToBlock = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId)}, {
      username: 1, firstname: 1, lastname: 1
    }))[0]
    if(!userToBlock) throwAnError('User you want to block not found', 404)
    if(user.blacklist.some(u => u._id === userId)) return false
    for await (let l of lists) User.pullSomething(user._id, l, { _id: userId })
    for await (let l of lists) User.pullSomething(userId, l, { _id: userId })

    await User.pushSomething(user._id, 'blacklist', User.formatUserAsFollower(userToBlock))
    return true
  } catch(err) {
    checkAndThrowError(err)
  }
}

exports.unblockUser = async function(userId, req){
  try{
    if(!req.user) throwAnError('Authorization failed', 400)
    if(req.user._id === userId) return false
    const user = req.user
    if(!user.blacklist.some(u => u._id === userId)) return false
    const userToUnblock = (await User.getSpecificFields({ _id: new mongo.ObjectID(userId) }, { _id: 1 }))[0]
    if(!userToUnblock) throwAnError('User to unblock is not found', 404)
    await User.pullSomething(user._id, 'blacklist', { _id: userId })
    return true
  } catch(err){
    checkAndThrowError(err)
  }
}

exports.isAbleToContact = async function(userId, req){
  try {
    if(!req.user) return false 
    if(req.user._id === userId) return true
    const userThatWantsContact = req.user
    if(userThatWantsContact.blacklist.some(u => u._id === userId)) throwAnError('Cannot contact blocked user', 422)
    const userToContact = (await User.getSpecificFields({ _id : new mongo.ObjectID(userId)}, { blacklist: 1, public: 1, followers: 1, following: 1 }))[0]
    if(!userToContact) return false
    if(userToContact.blacklist.some(u => u._id === userThatWantsContact._id)) throwAnError('Cannot contact user', 422)
    if(userToContact.public) return true
    return !userToContact.public && userToContact.followers.some(f => f._id === userThatWantsContact._id) && userToContact.following.some(f => f._id === userThatWantsContact._id)
      ? true
      : false    
  } catch (err) {
    checkAndThrowError(err)
  }
}