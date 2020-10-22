const { ObjectID } = require('mongodb')
const { UserSettings } = require('../../js/models/UserSettings')
const {checkAndThrowError} = require('../../utils/error-handlers')


module.exports = async function(userId){
  try {
    const isUserPublic = await UserSettings.getSpecificFields({ _id: new ObjectID(userId) }, { public: 1 })
    if(!isUserPublic) return false
    
    return isUserPublic.public
  } catch(err){
    checkAndThrowError(err)
  }
}