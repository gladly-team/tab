/* global fetch */
require('whatwg-fetch')

/**
 * Make an HTTP request to endpoint. Returns a promise.
 *
 * @param {string} endpoint - The URL of the endpoint.
 * @param {string} method - The HTTP method to use. Should be one of:
 * 'OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE'.
 * @param {object} data - Data to send with the request. This is an optional
 *  parameter.
 */
const fetchEndpoint = function (endpoint, method, data) {
  const options = {}
  options.method = method
  options.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

    // // If we have a token, use it.
    // const token = store.getState().user.token;
    // if (token) {
    //     options.headers['Authorization'] = 'Token ' + token;
    // }

    // Add the body to the request if it's not a GET or HEAD request.
  if (['GET', 'HEAD'].indexOf(method) === -1) {
    var requestData = data || {}
    options.body = JSON.stringify(requestData)
    options.credentials = 'same-origin' // send cookies
  }
  return fetch(endpoint, options)
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

function getUserCredentials () {
  const getCognitoCredentialsEndpoint = 'http://localhost:3000/get-cognito-user/'

  const mockResponse = {
    email: 'raul@gladly.io',
    password: 'RaulTest1'
  }

  return fetchEndpoint(getCognitoCredentialsEndpoint, 'GET')
    .then((response) => {
      if (IS_DEVELOPMENT) {
        return mockResponse
      }
      return response
    })
    .catch((err) => {
      if (IS_DEVELOPMENT) {
        return mockResponse
      }

      return err
    })
}

export {
  getUserCredentials
}
