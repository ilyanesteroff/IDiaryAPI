const login = require('./controllers/login')
const checkIfPwResetIsActual = require('./controllers/if-pw-reset-is-actual')
const acceptEmail = require('./controllers/accept-email')
const requestPwReset = require('./controllers/request-pw-reset')
const setNewPassword = require('./controllers/set-new-password')
const checkEmailAndUsername = require('./controllers/check-userame-email')
const ifEnoughSpace = require('./controllers/enough-available-space')

module.exports = router => {
  router.patch('/login', login)

  router.patch('/acceptEmail', acceptEmail)
   
  router.patch('/requestPasswordReset', requestPwReset)
    
  router.patch('/enoughSpace', ifEnoughSpace)
    
  router.patch('/setNewPassword', setNewPassword)

  router.patch('/getResetPassword', checkIfPwResetIsActual)
  
  router.patch('/checkUsernameAndEmail', checkEmailAndUsername)
}