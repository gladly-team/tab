/* eslint no-console: 0 */
import prompt from './promptUserInput'

// Safety check to prevent accidentally running database operations
// against a production DB.
const confirmCommand = callback => {
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
