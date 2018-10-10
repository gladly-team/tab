/* global fetch */
import { getUserToken } from 'js/authentication/user'
const {
  Environment,
  Network,
  RecordSource,
  Store
} = require('relay-runtime')

// Fetches the results of an operation (query/mutation/etc)
// and return its results as a Promise.
async function fetchQuery (
  operation,
  variables,
  cacheConfig,
  uploadables
) {
  try {
    // Add Authorization header if user has a token.
    const userToken = await getUserToken()
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (userToken) {
      headers['Authorization'] = userToken
    }

    return fetch(`//${process.env.GRAPHQL_ENDPOINT}`, {
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
            console.log('relay-env errors', responseJSON.errors)
            responseJSON.data = null
            return responseJSON
          }
          return responseJSON
        })
    })
  } catch (e) {
    console.error(e)
  }
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery)

const source = new RecordSource()
const store = new Store(source)

export default new Environment({
  network,
  store
})
