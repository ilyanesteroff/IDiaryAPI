const { User } = require('../../js/models/User')
const { UserInfo } = require('../../js/models/UserInfo')
const { UserSettings } = require('../../js/models/UserSettings')
const { checkAndThrowError } = require('../../utils/error-handlers')


//EAT stands for Email Approvement Token
module.exports = async (data, EAT, hashedPw) => {
  try {
    const { firstname, lastname, username, email } = data 
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: hashedPw
    })
    
    const savedUser = await newUser.save()

    const newUserSettings = new UserSettings({
      _id: savedUser._id,
      public: data.public,
      approveEmailToken: EAT,
      approved: false
    })
      
    await newUserSettings.save()
 
    const newUserInfo = new UserInfo({
      _id: savedUser._id
    })
  
    return await newUserInfo.save()
  } catch(err) {
    checkAndThrowError(err)
  }
}