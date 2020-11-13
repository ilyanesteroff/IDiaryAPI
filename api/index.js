const express = require('express')
const checkAuthorization = require('./middlewares/authorization-check')
const login = require('./controllers/login')
const countTodosByTag = require('./controllers/count-todos-by-tagname')
const checkIfPwResetIsActual = require('./controllers/if-pw-reset-is-actual')
const acceptEmail = require('./controllers/accept-email')
const requestPwReset = require('./controllers/request-pw-reset')
const setNewPassword = require('./controllers/set-new-password')
const verifyPassword = require('./controllers/veify-password')
const ifUserAbleToContact = require('./controllers/if-user-is-allowed')
const sendFollowRequest = require('./controllers/send-follow-request')
const unsendFollowRequest = require('./controllers/unsend-follow-request')
const rejectFollowRequest = require('./controllers/reject-follow-request')
const acceptFollowRequest = require('./controllers/accept-follow-request')
const unfollow = require('./controllers/unfollow')
const writeFirstMessage = require('./controllers/create-conversation')
const writeMessage = require('./controllers/write-message')
const deleteMessage = require('./controllers/delete-message')
const updateMessage = require('./controllers/update-message')
const toggleLikeMessage = require('./controllers/toggle-like-message')
const checkEmailAndUsername = require('./controllers/check-userame-email')
const viewMessages = require('./controllers/mark-messages-as-viewed')
const blockUser = require('./controllers/block-user')
const unblockUser = require('./controllers/unblock-user')
const ifUserFollows = require('./controllers/if-user-follows')
const requestFrom = require('./controllers/find-request-from')
const requestTo = require('./controllers/find-request-to')
const countMessages = require('./controllers/count-messages')


const router = express.Router()

router.patch('/login', login)

router.patch('/acceptEmail', acceptEmail)

router.patch('/requestPasswordReset', requestPwReset)

router.patch('/setNewPassword', setNewPassword)

router.patch('/countMessages', checkAuthorization, countMessages)

router.patch('/verifyPassword', checkAuthorization, verifyPassword)

router.patch('/ifUserAbleToContact', checkAuthorization, ifUserAbleToContact)

router.patch('/ifUserFollows', checkAuthorization, ifUserFollows)

router.patch('/requestTo', checkAuthorization, requestTo)

router.patch('/requestFrom', checkAuthorization, requestFrom)

router.patch('/sendFollowRequest', checkAuthorization, sendFollowRequest)

router.patch('/acceptFollowRequest', checkAuthorization, acceptFollowRequest)

router.patch('/writeFirstMessage', checkAuthorization, writeFirstMessage)

router.patch('/writeMessage', checkAuthorization, writeMessage)

router.patch('/updateMessage', checkAuthorization, updateMessage)

router.patch('/toggleLikeMessage', checkAuthorization, toggleLikeMessage)

router.patch('/viewMessages', checkAuthorization, viewMessages)

router.patch('/blockUser', checkAuthorization, blockUser)

router.patch('/getResetPassword', checkIfPwResetIsActual)

router.patch('/checkUsernameAndEmail', checkEmailAndUsername)

router.delete('/unsendFollowRequest/:reqId', checkAuthorization, unsendFollowRequest)

router.delete('/rejectFollowRequest/:reqId', checkAuthorization, rejectFollowRequest)

router.delete('/unfollowOrRemoveFollower/:followId', checkAuthorization, unfollow)

router.delete('/deleteMessage/:messageId', checkAuthorization, deleteMessage)

router.delete('/unblockUser/:username', checkAuthorization, unblockUser)

router.get('/countTodosByTag/:tag', checkAuthorization, countTodosByTag)

module.exports = router