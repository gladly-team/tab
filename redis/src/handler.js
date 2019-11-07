/* eslint no-console: 0 */

import redis from 'redis'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis)

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

const errors = {
  MISSING_OPERATION: {
    code: 'MISSING_OPERATION',
    message: 'The request body did not include an "operation" value.',
  },
  MISSING_KEY: {
    code: 'MISSING_KEY',
    message: 'The "key" property is required for this operation.',
  },
  NO_DATA: {
    code: 'NO_DATA',
    message: 'No data provided in the request body.',
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred.',
  },
  UNSUPPORTED_OPERATION: {
    code: 'UNSUPPORTED_OPERATION',
    message: 'The provided "operation" value is not supported.',
  },
}

/**
 * Create a response object with status code 400 and an appropriate
 * error code and message.
 * @param {Object} error
 * @param {String} error.code - The error code, returned to other services
 * @param {String} error.message - The error message, returned to other services
 * @return {Object} returnVal - the Lambda response object
 * @return {Number} returnVal.statusCode - the response code (400)
 * @return {String} returnVal.body - the response body
 */
const createBadRequestResponse = error => {
  return createResponse(400, {
    code: error.code,
    message: error.message,
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
    return createBadRequestResponse(errors.NO_DATA)
  }
  if (!body.operation) {
    return createBadRequestResponse(errors.MISSING_OPERATION)
  }

  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })

  let responseData
  try {
    switch (body.operation) {
      case 'GET':
        if (!body.key) {
          return createBadRequestResponse(errors.MISSING_KEY)
        }
        responseData = await client.getAsync(body.key)
        break
      case 'INCR':
        if (!body.key) {
          return createBadRequestResponse(errors.MISSING_KEY)
        }
        responseData = await client.incrAsync(body.key)
        break
      default:
        return createBadRequestResponse(errors.UNSUPPORTED_OPERATION)
    }
  } catch (e) {
    console.error(e)
    return createResponse(500, {
      code: errors.UNKNOWN_ERROR.code,
      message: errors.UNKNOWN_ERROR.message,
    })
  }
  await client.quitAsync()
  return createResponse(200, {
    data: responseData,
  })
}

export const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then(response => callback(null, response))
    .catch(err => callback(err, null))
}
