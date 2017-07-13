import cors from 'cors'
import express from 'express'

import getLambdas from './src/getLambdas'

// Load environment variables from .env file.
// https://github.com/keithmorris/node-dotenv-extended
require('dotenv-extended').load()

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const LAMBDA_PORT = process.env.LAMBDA_PORT

let appServer

// Approximate an AWS Lambda event object from the request.
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
//
// {
//     "resource": "Resource path",
//     "path": "Path parameter",
//     "httpMethod": "Incoming request's method name"
//     "headers": {Incoming request headers}
//     "queryStringParameters": {query string parameters }
//     "pathParameters":  {path parameters}
//     "stageVariables": {Applicable stage variables}
//     "requestContext": {Request context, including authorizer-returned key-value pairs}
//     "body": "A JSON string of the request payload."
//     "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }
function generateLambdaEventObj (req) {
  // Need to use body-parser if we want this to be populated
  const body = req.body ? JSON.stringify(req.body) : ''

  return {
    resource: '',
    path: req.baseUrl,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    pathParameters: {},
    stageVariables: {},
    // User identity (e.g. Cognito) lives in context. See:
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    requestContext: {},
    body: body,
    isBase64Encoded: false
  }
}

function startServer (callback) {
  // Shut down the server if it's running.
  if (appServer) {
    appServer.close()
  }

  const app = express()
  app.use(cors())

  // Set endpoints for lambda functions.
  const lambdas = getLambdas()
  lambdas.forEach((lambda) => {
    if (lambda.httpMethod === 'get') {
      app.get('/' + lambda.path, (req, res) => {
        lambda.handler(generateLambdaEventObj(req))
          .then(response => res.send(response))
      })
      console.log('Set up GET method at /' + lambda.path + ' for service "' + lambda.name + '".')
    } else if (lambda.httpMethod === 'post') {
      app.post('/' + lambda.path, (req, res) => {
        lambda.handler(generateLambdaEventObj(req))
          .then(response => res.send(response))
      })
      console.log('Set up POST method at /' + lambda.path + ' for service "' + lambda.name + '".')
    }
  })

  appServer = app.listen(LAMBDA_PORT, () => {
    console.log(
      `Lambda service is now running on http://localhost:${LAMBDA_PORT}`
    )
    if (callback) {
      callback()
    }
  })
}

startServer()
