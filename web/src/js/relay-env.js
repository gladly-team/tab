/* global fetch */
import { getUserToken } from 'js/authentication/user'
import logger from 'js/utils/logger'
const { Environment, Network, RecordSource, Store } = require('relay-runtime')

// Fetches the results of an operation (query/mutation/etc)
// and return its results as a Promise.
async function fetchQuery(operation, variables, cacheConfig, uploadables) {
  try {
    // Add Authorization header if user has a token.
    const userToken = await getUserToken()
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // If the user does not have a token, send a placeholder value.
    // We do this because AWS API Gateway's custom authorizers will
    // reject any request without a token and we want to provide
    // unauthenticated access to our API.
    // "If a specified identify source is missing, null, or empty,
    // API Gateway returns a 401 Unauthorized response without calling
    // the authorizer Lambda function.”
    // https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html"
    headers['Authorization'] = userToken || 'unauthenticated'

    return fetch(`//${process.env.REACT_APP_GRAPHQL_ENDPOINT}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    }).then(response => {
      return response.json().then(responseJSON => {
        // Temporary fix to force passing errors on to the
        // QueryRenderer.
        // https://github.com/facebook/relay/issues/1913
        if (responseJSON.errors && responseJSON.errors.length > 0) {
          logger.error(responseJSON.errors)
          responseJSON.data = null
          return responseJSON
        }
        return responseJSON
      })
    })
  } catch (e) {
    logger.error(e)
  }
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery)

const source = new RecordSource()
const store = new Store(source)

export default new Environment({
  network,
  store,
})
