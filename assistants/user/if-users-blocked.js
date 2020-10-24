const { BlockedUser } = require('../../js/models/BlockedUser')


module.exports = async function(user1Id, user2Id){
  try {
    const ifAuthorBlocked = await BlockedUser.findById(user1Id, user2Id)
    if(ifAuthorBlocked) return true
    const ifUserBlocked = await BlockedUser.findById(user2Id, user1Id)
    if(ifUserBlocked) return true
    
    return false
  } catch(err){
    throw err
  }
}