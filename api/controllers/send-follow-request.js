const { ObjectID } = require('mongodb')
const { User } = require('../../js/models/User')
const { Follower } = require('../../js/models/Follower')
const { Request } = require('../../js/models/Request')
const ifSomeoneIsBlocked = require('../../assistants/user/if-users-blocked')
const updateUserActivity = require('../../assistants/update-user-activity')


module.exports = async function(req, res){
  try {
    const { user } = req
    const { to } = req.body
    if(!to) return res.status(400).json({ error: 'Request receiver is missing' })
    
    updateUserActivity(user._id)

    if(user._id === to) return res.status(400).json({ error: 'Cannot send follow request to yourself' })
    
    const someoneIsBlocked = await ifSomeoneIsBlocked(to, user._id)
    if(someoneIsBlocked) return res.status(400).json({ error: 'Security violation' })
    const ifAlreadyFollows = await Follower.findFollower(to, user.username)
    if(ifAlreadyFollows) return res.status(400).json({ error: 'User already follows' })
    const ifReqSent = await Request.findRequestFrom(to, user.username)
    if(ifReqSent) return res.status(400).json({ error: 'Request already sent' })

    const requestReceiver = await User.getSpecificFields({ _id: new ObjectID(to) }, { username: 1, lastname: 1, firstname: 1 })
    if(!requestReceiver) return res.status(404).json({ error: 'Receiver not found' })
    
    const request = new Request({
      sender: { ...User.formatUserAsFollower(user), _id: user._id },
      receiver: { ...requestReceiver, _id: requestReceiver._id.toString() },
      sentAt: new Date
    })
    const savedReq = await request.save()

    return res.status(201).json({ requestSent: savedReq })
  } catch(err) {
    return res.status(500).json({ error: err.massage || 'Something went wrong'  })
  }
}
  