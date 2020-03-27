import { URL } from 'url'
import fetch from 'node-fetch'
import aws4 from 'aws4'
// import logger from './logger'

// Note: for now, we manually deploy the Redis service whenever
// we need it and then destroy it when it's unused to reduce costs.
// To enable the Redis service, make sure it's deployed and active, then
// provide GraphQL access to it in GraphQL's serverless.yml.

const redisAccessEndpoint = `${process.env.REDIS_SERVICE_ENDPOINT}/redis`

// Key namespaces:
// - "campaign:*" used for campaign data

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
    const responseBody = await response.json()
    responseData = responseBody.data

    // Log any error message returned from the Redis service.
    if (!response.ok) {
      throw new Error(
        `Bad request data sent to the Redis service: ${responseBody.message}`
      )
    }
  } catch (e) {
    // logger.error(e) // TODO: reenable
    throw e
  }

  return responseData
}

export default callRedis
