const checkAuthorization = require('./middlewares/authorization-check')
const countTodosByTag = require('./controllers/count-todos-by-tagname')
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
const viewMessages = require('./controllers/mark-messages-as-viewed')
const blockUser = require('./controllers/block-user')
const unblockUser = require('./controllers/unblock-user')
const ifUserFollows = require('./controllers/if-user-follows')
const requestFrom = require('./controllers/find-request-from')
const requestTo = require('./controllers/find-request-to')
const countMessages = require('./controllers/count-messages')
const getPresignedURL = require('./controllers/get-presigned-url')
const setAvatar = require('./controllers/set-avatar')
const deleteAvatar = require('./controllers/delete-avatar')


module.exports = router => {
  router.use(checkAuthorization)

  router.delete('/unsendFollowRequest/:reqId', unsendFollowRequest)

  router.delete('/rejectFollowRequest/:reqId', rejectFollowRequest)

  router.delete('/unfollowOrRemoveFollower/:followId', unfollow)

  router.delete('/deleteMessage/:messageId', deleteMessage)

  router.delete('/unblockUser/:username', unblockUser)

  router.delete('/deleteAvatar/:fileName', deleteAvatar)

  router.get('/countTodosByTag/:tag', countTodosByTag)

  router.patch('/setAvatar', setAvatar)

  router.patch('/ifUserAbleToContact', ifUserAbleToContact)
  
  router.patch('/getPresignedURL', getPresignedURL)

  router.patch('/ifUserFollows', ifUserFollows)

  router.patch('/requestTo', requestTo)

  router.patch('/requestFrom', requestFrom)

  router.patch('/sendFollowRequest', sendFollowRequest)
 
  router.patch('/acceptFollowRequest', acceptFollowRequest)

  router.patch('/writeFirstMessage', writeFirstMessage)

  router.patch('/writeMessage', writeMessage)

  router.patch('/updateMessage', updateMessage)

  router.patch('/toggleLikeMessage', toggleLikeMessage)

  router.patch('/viewMessages', viewMessages)

  router.patch('/blockUser', blockUser)

  router.patch('/countMessages', countMessages)

  router.patch('/verifyPassword', verifyPassword)
}