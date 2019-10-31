/* eslint no-console: 0 */

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
})

export const handler = async event => {
  try {
    JSON.parse(event.body)
  } catch (e) {
    return createResponse(500, e)
  }
  console.log('Testing out Tab Redis.')
  return createResponse(200, { just: 'a-test' })
}

export const serverlessHandler = (event, context, callback) => {
  handler(event).then(response => callback(null, response))
}
