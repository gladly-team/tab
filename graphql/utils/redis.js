// FIXME: debugging only.
/* eslint-disable */
// import fetch from 'node-fetch'

const callRedis = async data => {
  try {
    console.log(
      '===== Calling Redis service =====',
      process.env.redisServiceEndpoint
    )
  } catch (e) {
    console.log('Error calling Redis service', e)
  }
}

export default callRedis
