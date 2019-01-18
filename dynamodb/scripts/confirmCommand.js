import prompt from './promptUserInput.js'

// Safety check to prevent accidentally running database operations
// against a production DB.
const confirmCommand = function(callback) {
  const databaseEndpoint = process.env.DYNAMODB_ENDPOINT

  // Standard local dev enpoint.
  if (databaseEndpoint === 'http://localhost:8000') {
    callback()
    return
  }

  prompt(
    `You are running against a database at ${databaseEndpoint}. Are you sure you want to continue? (y/n)\n`,
    response => {
      if (response !== 'y') {
        console.log('Exiting.')
        process.exit()
      } else {
        callback()
      }
    }
  )
}

export default confirmCommand
