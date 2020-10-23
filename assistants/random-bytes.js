const crypto = require('crypto')
const { promisify } = require('util')

module.exports = promisify(crypto.randomBytes)