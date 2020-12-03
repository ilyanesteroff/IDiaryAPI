const express = require('express')

const router = express.Router()

require('./routes')(router)

require('./authRoutes')(router)

module.exports = router