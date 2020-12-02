const s3 = require('./config')
const { promisify } = require('util')

class S3 {
  constructor(S3){
    this.S3 = S3
  }

  getURL(key){
    return this.S3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_BUCKET,
      ContentType: 'image/jpeg',
      Key: key
    })
      .then(res => res)
      .catch(_ => {
        return false
      })
  }

  deleteFile(key){
    return this.S3.deleteObject({
      Bucket: process.env.AWS_BUCKET, 
      Key: key
    }).promise()
      .then(res => res)
      .catch(_ => {
        return false
      })
  }
}

module.exports = new S3(s3)