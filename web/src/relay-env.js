/* global fetch */
const {
  Environment,
  Network,
  RecordSource,
  Store
} = require('relay-runtime')
const getUserIdToken = require('./js/utils/cognito-auth').getUserIdToken

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery (
  operation,
  variables,
  cacheConfig,
  uploadables
) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  // Add Authorization header if user has a token.
  const userIdToken = getUserIdToken()
  if (userIdToken) {
    headers['Authorization'] = userIdToken
  }

  return fetch(process.env.GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables
    })
  }).then(response => {
    return response.json()
  })
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery)

const source = new RecordSource()
const store = new Store(source)

export default new Environment({
  network,
  store
})
