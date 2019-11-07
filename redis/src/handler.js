/* eslint no-console: 0 */

import redis from 'redis'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis)

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

const missingKeyResponse = () => {
  return createResponse(500, {
    message: 'The "key" property is required for this operation.',
  })
}

/**
 * Perform a Redis operation and return a value as needed.
 * @param {Object} event - The AWS Lambda event received from API Gateway.
 * @param {String} event.body - The request data, stringified.
 * @return {Object} returnVal - the Lambda response object
 * @return {Number} returnVal.statusCode - the response code
 * @return {String} returnVal.body - the response body
 */
export const handler = async event => {
  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return createResponse(500, {
      message: 'No data provided in the request body.',
    })
  }
  if (!body.operation) {
    return createResponse(500, {
      message: 'The request body did not include an "operation" value.',
    })
  }

  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })

  // TODO: tests
  let responseData
  try {
    switch (body.operation) {
      case 'GET':
        if (!body.key) {
          return missingKeyResponse()
        }
        await client.getAsync(body.key)
        break
      case 'INCR':
        if (!body.key) {
          return missingKeyResponse()
        }
        await client.incrAsync(body.key)
        break
      default:
        return createResponse(500, {
          message: 'The provided "operation" value is not supported.',
        })
    }
  } catch (e) {
    createResponse(200, { error: true, data: null })
  }
  await client.quitAsync()
  return createResponse(200, {
    error: false,
    data: responseData,
  })
}

export const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then(response => callback(null, response))
    .catch(err => callback(err, null))
}
