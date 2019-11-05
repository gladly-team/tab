// FIXME: debugging only.
/* eslint-disable */
import fetch from 'node-fetch'

const redisAccessEndpoint = `${process.env.REDIS_SERVICE_ENDPOINT}/redis/`

const callRedis = async data => {
  let responseData
  try {
    console.log('===== Calling Redis service =====', redisAccessEndpoint)
    const response = await fetch(redisAccessEndpoint, {
      method: 'POST',
    })
    responseData = await response.json()
  } catch (e) {
    console.log('Error calling Redis service', e)
  }
  console.log('===== Redis service response data =====', responseData)
}

export default callRedis
