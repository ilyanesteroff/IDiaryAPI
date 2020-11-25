const { User } = require('../../js/models/User')
const { throwAnError, checkAndThrowError } = require('../../utils/error-handlers')
const someoneBlocked = require('../../assistants/user/if-users-blocked')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(username, page, client) {
  try{
    !client && throwAnError('Authorization failed', 400)
    updateUserActivity(client._id)
    const users = await User.findManyUsers( { 
      $or :[
        { username : { $regex : '^' + username, $options: 'i' } },
        { firstname : { $regex : '^' + username, $options: 'i' } },
        { lastname : { $regex : '^' + username, $options: 'i' } }
      ]
    }, page, parseInt(process.env.ITEMS_PER_PAGE)) 
                                          
    const output = []

    for await (let user of users){
      const ifBlocked = await someoneBlocked(user._id.toString(), client._id)
      if(!ifBlocked){
        user._id = user._id.toString()
        output.push(user)
      } 
    }

    return output
  } catch(err){
    checkAndThrowError(err)
  }
}