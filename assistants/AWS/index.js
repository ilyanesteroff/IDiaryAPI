const s3 = require('./config')

module.exports = class S3 {
  static getURL(key){
    return s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_BUCKET,
      ContentType: 'image/jpeg',
      Key: key
    })
      .then(res => res)
      .catch(_ => {
        return false
      })
  }

  static deleteFile(key){
    return s3.deleteObject({
      Bucket: process.env.AWS_BUCKET, 
      Key: key
    }).promise()
      .then(res => res)
      .catch(_ => {
        return false
      })
  }
}