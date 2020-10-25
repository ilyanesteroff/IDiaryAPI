const approveEmail = require('../api/controllers/accept-email')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')

req = {
  body: {
    token: '68a4c16c0f437e395b1b7b14f90eb7a74146ed819048d088'
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