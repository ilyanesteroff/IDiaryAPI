const { Follower } = require('../../js/models/Follower')
const { checkAndThrowError, throwAnError } = require('../../utils/error-handlers')


module.exports = async function*(userId) {
  try {
    !userId && throwAnError('No user id provided', 404)

    yield await Follower.countFollowers(userId)
    yield await Follower.countFollowing(userId)
  } catch(err){
    checkAndThrowError(err)
  }
}