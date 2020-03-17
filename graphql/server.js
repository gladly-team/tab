/* eslint import/no-extraneous-dependencies: 0, no-console: 0 */
import chokidar from 'chokidar'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import graphQLHTTP from 'express-graphql'
import { clean } from 'require-clean'
import { exec } from 'child_process'
import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
} from './utils/authorization-helpers'
import { loggerContextWrapper } from './utils/logger'
import { handleError } from './utils/error-logging'

const graphQLPort = process.env.DEVELOPMENT_GRAPHQL_PORT

let graphQLServer

function startGraphQLServer(callback) {
  clean('./data/schema')
  clean('./handler')
  clean('./utils/dev-tools')
  const { Schema } = require('./data/schema')
  const {
    generateLambdaEventObjFromRequest,
    getGraphQLContextFromRequest,
  } = require('./utils/dev-tools')

  const graphQLApp = express()
  graphQLApp.use(cors())
  graphQLApp.use(bodyParser.json())
  graphQLApp.use(bodyParser.urlencoded({ extended: true }))

  const graphiQLEnabled = process.env.DEVELOPMENT_ENABLE_GRAPHIQL === 'true'
  if (graphiQLEnabled) {
    console.info(`GraphiQL is enabled on port ${graphQLPort}.`)
  } else {
    console.info(`GraphiQL is disabled.`)
  }

  // https://github.com/graphql/express-graphql#options
  graphQLApp.use(
    '/',
    graphQLHTTP(req => {
      // Wrap our handler in a logger to match the logger setup
      // we user in our production handler.
      const event = generateLambdaEventObjFromRequest(req)
      const claims = getUserClaimsFromLambdaEvent(event)
      const context = createGraphQLContext(claims)
      return loggerContextWrapper(context.user, event, () => {
        return {
          graphiql: graphiQLEnabled,
          pretty: true,
          schema: Schema,
          context: getGraphQLContextFromRequest(req),
          customFormatErrorFn: handleError,
        }
      })
    })
  )

  graphQLServer = graphQLApp.listen(graphQLPort, () => {
    console.info(
      `GraphQL server is now running on http://localhost:${graphQLPort}`
    )
    if (callback) {
      callback()
    }
  })
}

function startServer(callback) {
  // Shut down the server
  if (graphQLServer) {
    graphQLServer.close()
  }

  // Compile the schema
  exec('yarn run update-schema', (error, stdout) => {
    console.info(stdout)
    function handleTaskDone() {
      if (callback) {
        callback(new Error(error))
      }
    }
    startGraphQLServer(handleTaskDone)
  })
}

// Watch for DB or schema changes.
const watcher = chokidar.watch([
  './server.js',
  './data/{schema}.js',
  './database/*.js',
  './database/*/*.js',
])

watcher.on('change', path => {
  console.info(`\`${path}\` changed. Restarting.`)
  startServer(() => console.info('GraphQL server schema updated.'))
})

startServer()
