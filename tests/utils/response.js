

module.exports = res = {
  json: function(_res) {
    console.log(_res)
  },
  status: function(s) {
    this.statusCode = s
    return this
  }
}