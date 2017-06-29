import chokidar from 'chokidar'
import cors from 'cors'
import express from 'express'
import raven from 'raven'
import PrettyError from 'pretty-error'
import bodyParser from 'body-parser'
import graphQLHTTP from 'express-graphql'
import {clean} from 'require-clean'
import {exec} from 'child_process'

import config from './config'
import { handler } from './handler'

const GRAPHQL_PORT = config.GRAPHQL_PORT

const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express', 'graphql')

// Must configure Raven before doing anything else with it
raven.config(config.SENTRY_DSN).install()

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
  return {
    resource: '',
    path: req.baseUrl,
    httpMethod: req.method,
    headers: req.headers,
    queryStringParameters: req.query,
    pathParameters: {},
    stageVariables: {},
    requestContext: {},
    body: JSON.stringify(req.body),
    isBase64Encoded: false
  }
}

function getGraphQLMiddleware () {
  clean('./data/schema')
  const {Schema} = require('./data/schema')

  const graphQLMiddleware = graphQLHTTP(req => ({
    graphiql: true,
    pretty: true,
    schema: Schema,
    formatError: (error) => {
      if (error.path || error.name !== 'GraphQLError') {
        console.error(pe.render(error))
        raven.captureException(error,
            raven.parsers.parseRequest(req, {
              tags: { graphql: 'exec_error' },
              extra: {
                source: error.source && error.source.body,
                positions: error.positions,
                path: error.path
              }
            })
          )
      } else {
        console.error(pe.render(error.message))
        raven.captureMessage(`GraphQLWrongQuery: ${error.message}`,
            raven.parsers.parseRequest(req, {
              tags: { graphql: 'wrong_query' },
              extra: {
                source: error.source && error.source.body,
                positions: error.positions
              }
            })
          )
      }
      return {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null
      }
    },
    context: {
      userId: req.userId,
      userEmail: req.userEmail,
      admin: req.admin,
      getUserPromise: req.getUserPromise ? req.getUserPromise.bind(req) : null,
      getAdminPromise: req.getAdminPromise ? req.getAdminPromise.bind(req) : null,
      ip: req.ip || (req.connection || {}).remoteAddress
    }
  }))

  return graphQLMiddleware
}

function startGraphQLServer (callback) {
  const graphQLApp = express()
  graphQLApp.use(cors())
  graphQLApp.use(bodyParser.json())
  graphQLApp.use(bodyParser.urlencoded({ extended: true }))

  // The request handler must be the first middleware on the app
  graphQLApp.use(raven.requestHandler())

  // Use express-graphql in development if desired.
  // Otherwise, just use our plain Lambda handler.
  if (config.NODE_ENV === 'development' && config.ENABLE_GRAPHIQL) {
    graphQLApp.use('/', getGraphQLMiddleware())
  } else {
    graphQLApp.post('/', (req, res) => {
      const event = generateLambdaEventObj(req)
      handler(event)
        // Use only the body (the rest is for use within an AWS Lambda context)
        .then(response => res.send(response.body))
    })
  }

  // Error handling
  graphQLApp.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(pe.render(err)) // eslint-disable-line no-console
    res.status(err.status || 500)
    res.setHeader('Content-Type', 'text/plain')
    res.send(err.stack)
  })

  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, (err) => {
    if (err) {
      console.log(pe.render(err)) // eslint-disable-line no-console
      return err
    }

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
