import { URL } from 'url'
import fetch from 'node-fetch'
import aws4 from 'aws4'
import logger from './logger'

const redisAccessEndpoint = `${process.env.REDIS_SERVICE_ENDPOINT}/redis`

/**
 * Call the Redis service.
 * @param {Object} data - Data on the operation to perform on Redis.
 * @param {String} data.key - The Redis item key
 * @param {String} data.operation - The Redis operation. One of: GET, INCR
 * @return {Object|String|Number} The Redis return value.
 */
const callRedis = async data => {
  let responseData = null
  try {
    // Add AWS IAM authorization.
    // https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
    // https://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-javascript
    // https://github.com/mhart/aws4
    const endpointURL = new URL(redisAccessEndpoint)
    const body = JSON.stringify(data)
    const authorizationInfo = aws4.sign({
      host: endpointURL.host,
      path: endpointURL.pathname,
      method: 'POST',
      body,
    })

    const response = await fetch(redisAccessEndpoint, {
      method: 'POST',
      headers: {
        ...authorizationInfo.headers,
      },
      body,
    })
    responseData = await response.json()

    // Log any error message returned from the Redis service.
    if (!response.ok) {
      throw new Error(
        `Bad request data sent to the Redis service: ${responseData.message}`
      )
    }
  } catch (e) {
    logger.error(e)
    throw e
  }

  // eslint-disable-next-line no-console
  console.log('===== Redis service response data =====', responseData)

  return responseData
}

export default callRedis
