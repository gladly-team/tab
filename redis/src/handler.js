/* eslint no-console: 0 */

import redis from 'redis'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis)

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

const errors = {
  NO_DATA: {
    code: 'NO_DATA',
    message: 'No data provided in the request body.',
  },
  MISSING_OPERATION: {
    code: 'MISSING_OPERATION',
    message: 'The request body did not include an "operation" value.',
  },
  UNSUPPORTED_OPERATION: {
    code: 'UNSUPPORTED_OPERATION',
    message: 'The provided "operation" value is not supported.',
  },
  MISSING_KEY: {
    code: 'MISSING_KEY',
    message: 'The "key" property is required for this operation.',
  },
}

const missingKeyResponse = () => {
  return createResponse(500, {
    code: errors.MISSING_KEY.code,
    message: errors.MISSING_KEY.message,
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
      code: errors.NO_DATA.code,
      message: errors.NO_DATA.message,
    })
  }
  if (!body.operation) {
    return createResponse(500, {
      code: errors.MISSING_OPERATION.code,
      message: errors.MISSING_OPERATION.message,
    })
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
          return missingKeyResponse()
        }
        responseData = await client.getAsync(body.key)
        break
      case 'INCR':
        if (!body.key) {
          return missingKeyResponse()
        }
        responseData = await client.incrAsync(body.key)
        break
      default:
        return createResponse(500, {
          code: errors.UNSUPPORTED_OPERATION.code,
          message: errors.UNSUPPORTED_OPERATION.message,
        })
    }
  } catch (e) {
    console.error(e)
    createResponse(500, { message: 'Something went wrong.' })
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
