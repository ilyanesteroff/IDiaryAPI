const bycrypt = require('bcryptjs')


module.exports = async function(req, res) {
  try {
    const { password } = req.body
    const verdict = await bycrypt.compare(password, req.user.password)

    return res.status(200).json({ passwordMatches: verdict })
  } catch(err){
    return res.status(500).json({ error: err.message })
  }
}