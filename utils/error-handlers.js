

exports.throwAnError = (message, status, data) => {
  const error = new Error(message)
  if(status) error.status = status
  if(data) error.data = data
  throw error
}