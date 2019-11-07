/* eslint no-console: 0 */

import redis from 'redis'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis)

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

// TODO: use Redis client library to get/set simple values.
export const handler = async event => {
  try {
    JSON.parse(event.body)
  } catch (e) {
    return createResponse(500, {
      message: 'No data provided in the request body.',
    })
  }
  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
  const fooVal = await client.incrAsync('foo')
  await client.quitAsync()
  return createResponse(200, { foo: fooVal })
}

export const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then(response => callback(null, response))
    .catch(err => callback(err, null))
}
