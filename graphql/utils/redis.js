const aws = require('aws-sdk')
// import { Lambda } from 'aws-sdk'

const callRedis = async data => {
  const lambda = new aws.Lambda({
    region: 'us-west-2', // TODO: env var
  })
  const event = {
    type: 'foo',
    data,
  }
  try {
    lambda.invoke(
      {
        FunctionName: 'tab-redis-dev-tabRedis', // TODO: env var
        Payload: JSON.stringify(event, null, 2),
      },
      (error, response) => {
        if (error) {
          throw new Error(error)
        }
        if (response) {
          return response.Payload
        }
        return null
      }
    )
  } catch (e) {
    console.log('Error invoking', e)
  }
}

export default callRedis
