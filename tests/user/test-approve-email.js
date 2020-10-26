const approveEmail = require('../../api/controllers/accept-email')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')

req = {
  body: {
    token: 'cb92f9c4369786bb8fe09fa946144da7a5ee725fcf3b24ba'
  }
}

const approve = async _ => {
  try {
    await approveEmail(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => approve())