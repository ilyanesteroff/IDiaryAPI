const { S3 } = require('aws-sdk')


module.exports = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCES_KEY,
  region: process.env.AWS_LOCATION
})