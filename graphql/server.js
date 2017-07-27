import chokidar from 'chokidar'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import graphQLHTTP from 'express-graphql'
import {clean} from 'require-clean'
import {exec} from 'child_process'

import config from './config'
import { generateLambdaEventObjFromRequest } from './utils/dev-tools'

const GRAPHQL_PORT = config.GRAPHQL_PORT

let graphQLServer

function startGraphQLServer (callback) {
  clean('./data/schema')
  clean('./handler')
  const { Schema } = require('./data/schema')
  const { handler } = require('./handler')

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
