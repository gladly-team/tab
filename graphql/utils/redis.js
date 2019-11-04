// FIXME: debugging only.
/* eslint-disable */
import fetch from 'node-fetch'

const callRedis = async data => {
  let responseData
  try {
    console.log(
      '===== Calling Redis service =====',
      process.env.redisServiceEndpoint
    )
    const response = await fetch(process.env.redisServiceEndpoint, {
      method: 'POST',
    })
    responseData = response.json()
  } catch (e) {
    console.log('Error calling Redis service', e)
  }
  console.log('===== Redis service response data =====', responseData)
}

export default callRedis
