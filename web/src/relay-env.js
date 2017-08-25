/* global fetch */
const {
  Environment,
  Network,
  RecordSource,
  Store
} = require('relay-runtime')
const cognitoAuth = require('./js/utils/cognito-auth')

// Fetches the results of an operation (query/mutation/etc)
// and return its results as a Promise.
function fetchQuery (
  operation,
  variables,
  cacheConfig,
  uploadables
) {
  // TODO: mock user token here on dev
  return cognitoAuth.getUserIdToken().then((userIdToken) => {
    // Add Authorization header if user has a token.
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
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
        .then((responseJSON) => {
          // Temporary fix to force passing errors on to the
          // QueryRenderer.
          // https://github.com/facebook/relay/issues/1913
          if (responseJSON.errors && responseJSON.errors.length > 0) {
            responseJSON.data = null
            return responseJSON
          }
          return responseJSON
        })
    })
  }).catch((err) => {
    console.log(err)
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
