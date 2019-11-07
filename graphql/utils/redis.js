/* eslint no-console:0 */
// TODO: remove eslint-disable

import { URL } from 'url'
import fetch from 'node-fetch'
import aws4 from 'aws4'

const redisAccessEndpoint = `${process.env.REDIS_SERVICE_ENDPOINT}/redis`

// TODO:
//   - call to get/set values
//   - gracefully handle Redis downtime or missing cache value
const callRedis = async data => {
  let responseData
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

    console.log('===== Calling Redis service =====', redisAccessEndpoint)
    const response = await fetch(redisAccessEndpoint, {
      method: 'POST',
      headers: {
        ...authorizationInfo.headers,
      },
      body,
    })
    responseData = await response.json()
  } catch (e) {
    console.log('Error calling Redis service', e)
  }
  console.log('===== Redis service response data =====', responseData)
}

export default callRedis
