const { getDb } = require('../js/utils/db-connection')


module.exports = async function(){
  return getDb().stats()
    .then(res => {
      return {
        avarage: res.avgObjSize,
        available: res.storageSize - res.dataSize
      }
    })
}