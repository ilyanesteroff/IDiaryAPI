const getDbStats = require('../../assistants/getDbStats')


module.exports = async function(req, res){
  try {
    const { documentsAmount } = req.body
    if(!documentsAmount) return res.status(400).json({ error: 'Amount of documents for creation is missing' })

    const stats = await getDbStats()

    return res.status(200).json({ enough: documentsAmount * stats.avarage * 1.5 > stats.available })

  } catch(err) {
    return res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}