const requestPWChange = require('../../api/controllers/request-pw-reset')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')

req = {
  body: {
    field: 'ilya'
  }
}

const request = async _ => {
  try {
    await requestPWChange(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => request())