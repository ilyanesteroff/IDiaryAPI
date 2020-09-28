const bycrypt = require('bcryptjs')
const {User} = require('../../js/models/User')
const {Todo} = require('../../js/models/Todo')
const {lists} = require('../assistants/vars')
const {throwAnError} = require('../../utils/error-handlers')
const {randomBytes} = require('../assistants/random-bytes')
const sendMail = require('../assistants/email-sender')

exports.createUser = async function(userInput, req) {
  //reminder to add twilio and sendgrid
  try {
    const hashedPw = await bycrypt.hash(userInput.password, 16)
    const approveEmailToken = (await randomBytes(24)).toString('hex')
    userInput.password = hashedPw
    userInput.approveEmailToken = approveEmailToken
    const newUser = new User(userInput)
    await newUser.save()
    sendMail.sendAcceptEmail(userInput.email, 'accept email', approveEmailToken)
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
    await User.updateUser(req.user._id, { $set: userInput })
    return true
  } catch(err) {
    return false
  }
}

exports.deleteUser = async function(req){
  if(!req.user) throwAnError('Authorization failed', 400)
  try {
    for await(let f of lists) User.deleteRequestsOfDeletedUser(req.user._id, f)
    await Todo.deleteTodosOfDeletedUser(req.user._id)
    await User.deleteUser(req.user._id)
    return true
  } catch(err) {
    console.log(err)
    return false
  }
}

//this function checks whether username and email are available, can be used when creating a new user or updating existing one
exports.checkUsernameAndEmail = async function(email, username){
  const user = (await User.getSpecificFields({$or: [{email: email}, {username: username}]}, { _id : 1 }))[0]
  //returns false if no users found matching the query above and true otherwise
  return !user
    ? false
    : true
}
