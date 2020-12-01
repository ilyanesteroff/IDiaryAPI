const express = require('express')

const router = express.Router()

require('./authRoutes')(router)

require('./routes')(router)

module.exports = router