const { User } = require('../../js/models/User')
const { checkAndThrowError } = require('../../utils/error-handlers')


module.exports = async function verifyEmailAndUsername(email, username){
  try {
    const user = await User.getSpecificFields({$or: [{email: email}, {username: username}]}, { _id : 1 })
    //returns false if no users found matching the query above and true otherwise
    return !user
      ? false
      : true
  } catch(err) {
    checkAndThrowError(err)
  }
}