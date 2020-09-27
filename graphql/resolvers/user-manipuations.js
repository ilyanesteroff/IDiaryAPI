const {User} = require('../../js/models/User')
const bycrypt = require('bcryptjs')
const {throwAnError} = require('../../utils/error-handlers')

exports.createUser = async function(userInput, req) {
  //reminder to add twilio and sendgrid
  try {
    const hashedPw = await bycrypt.hash(userInput.password, 16)
    userInput.password = hashedPw
    const newUser = new User(userInput)
    await newUser.save()
    return true
  } catch (err) {
    console.log(err.message)
    return false
  }
}

exports.updateUser = async function(userInput, req){
  if(!req.user) throwAnError('Authorization failed', 400)
  try {
    if(userInput.password) userInput.password = await bycrypt.hash(userInput.password, 16)
    await User.updateUser(req.user._id, { $set: userInput})
    return true
  } catch {
    return false
  }
}

exports.deleteUser = async function(req){
  if(!req.user) throwAnError('Authorization failed', 400)
  try {
    await User.deleteUser(req.user._id)
    return true
  } catch {
    return false
  }
}

//this function checks whether username and email are available, can be used when creating a new user or updating existing one
exports.checkUsernameAndEmail = async function(email, username){
  const user = await User.findUser({$or: [{email: email}, {username: username}]})
  //returns false if no users found matching the query above and true otherwise
  return !user
    ? false
    : true
}
