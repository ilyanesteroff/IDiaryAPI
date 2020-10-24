const { ObjectID } = require('mongodb')
const { UserSettings } = require('../../js/models/UserSettings')


module.exports = async function(userId){
  try {
    const isUserPublic = await UserSettings.getSpecificFields({ _id: new ObjectID(userId) }, { public: 1 })
    if(!isUserPublic) throw new Error('User not found')
    
    return isUserPublic.public
  } catch(err){
    throw err
  }
}