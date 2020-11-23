const { mongoConnect } = require('../../js/utils/db-connection')
const dbStats = require('../../assistants/getDbStats')


mongoConnect(_ => dbStats())