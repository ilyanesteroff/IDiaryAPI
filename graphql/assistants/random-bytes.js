const crypto = require('crypto')
const { promisify } = require('util')

exports.randomBytes = promisify(crypto.randomBytes)