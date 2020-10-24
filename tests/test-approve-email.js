const approveEmail = require('../api/controllers/accept-email')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')

req = {
  body: {
    token: 'bc624dff2c26a800aa97e510eae064619d630036ee44df41'
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