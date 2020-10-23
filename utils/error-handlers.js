

exports.throwAnError = (message, status) => {
  const error = new Error(message)
  if(status) error.status = status
  throw error
}

exports.checkAndThrowError = (error) => {
  if(error.status) throw error
  else this.throwAnError(error.message, 500)
}