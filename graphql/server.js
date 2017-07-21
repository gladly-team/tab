import chokidar from 'chokidar'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import graphQLHTTP from 'express-graphql'
import {clean} from 'require-clean'
import {exec} from 'child_process'

import config from './config'
import { handler } from './handler'

const GRAPHQL_PORT = config.GRAPHQL_PORT

let graphQLServer

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
  // TODO: send from client & decode, or make dynamic
  const authorizationClaims = {
    sub: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
    aud: 'xyzxyzxyzxyzxyzxyzxyzxyzxyz',
    email_verified: 'true',
    token_use: 'id',
    auth_time: '1500670764',
    iss: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_abcdefgh',
    'cognito:username': 'myUserName',
    exp: 'Fri Jul 21 21:59:24 UTC 2017',
    iat: 'Fri Jul 21 20:59:24 UTC 2017',
    email: 'foo@bar.com'
  }
  return {
    resource: '',
    path: req.baseUrl,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    pathParameters: {},
    stageVariables: {},
    requestContext: {
      path: req.baseUrl,
      accountId: '123456789',
      resourceId: 'abcdef',
      stage: 'dev',
      authorizer: {
        claims: authorizationClaims
      },
      requestId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        apiKey: '',
        sourceIp: '123.4.567.890',
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36',
        user: null
      },
      resourcePath: '/graphql',
      httpMethod: req.method,
      apiId: 'abcdefghij'
    },
    body: JSON.stringify(req.body),
    isBase64Encoded: false
  }
}

function startGraphQLServer (callback) {
  clean('./data/schema')
  const { Schema } = require('./data/schema')

  const graphQLApp = express()
  graphQLApp.use(cors())
  graphQLApp.use(bodyParser.json())
  graphQLApp.use(bodyParser.urlencoded({ extended: true }))

  // Use express-graphql in development if desired.
  // Otherwise, just use our plain Lambda handler.
  if (config.NODE_ENV === 'development' && config.ENABLE_GRAPHIQL) {
    graphQLApp.use('/', graphQLHTTP({
      graphiql: true,
      pretty: true,
      schema: Schema,
      // TODO: standardize with context passed via handler
      context: {}
    }))
  } else {
    graphQLApp.post('/', (req, res) => {
      const event = generateLambdaEventObj(req)
      handler(event)
        // Use only the body (the rest is for use within an AWS Lambda context)
        .then(response => res.send(response.body))
    })
  }

  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    )
    if (callback) {
      callback()
    }
  })
}

function startServer (callback) {
  // Shut down the server
  if (graphQLServer) {
    graphQLServer.close()
  }

  // Compile the schema
  exec('yarn run update-schema', (error, stdout) => {
    console.log(stdout)
    function handleTaskDone () {
      if (callback) {
        callback(new Error(error))
      }
    }
    startGraphQLServer(handleTaskDone)
  })
}

// Watch for DB or schema changes.
const watcher = chokidar.watch([
  './data/{schema}.js',
  './database/*.js',
  './database/*/*.js'])

watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`)
  startServer(() =>
    console.log('GraphQL server schema updated.')
  )
})

startServer()
