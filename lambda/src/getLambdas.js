// This file gets all lambda functions from the Serverless
// config and exports the handlers and endpoint info.

import path from 'path'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import YAML from 'yamljs'
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { has } from 'lodash'

// FIXME
const getServerlessConfig = () =>
  YAML.load(path.join(__dirname, '..', 'serverless.yml'))

export const getLambdasFromServerlessConfig = serverlessConfig => {
  const lambdaFunctions = []
  if (serverlessConfig.functions) {
    const lambdas = serverlessConfig.functions
    Object.keys(lambdas).forEach(key => {
      const lambda = lambdas[key]

      // Only set up functions triggered by HTTP GET and POST events.
      if (lambda.events) {
        lambda.events.forEach(event => {
          const isHttpEvent =
            has(event, 'http.path') &&
            (event.http.method === 'get' || event.http.method === 'post')
          if (isHttpEvent) {
            const handlerModulePath = `./${key}/${key}`
            lambdaFunctions.push({
              name: key,
              path: event.http.path,
              httpMethod: event.http.method,
              // eslint-disable-next-line import/no-dynamic-require
              handler: require(handlerModulePath).handler,
            })
          }
        })
      }
    })
  }
  return lambdaFunctions
}

// Get our lambda functions from the Serverless config.
// Return objects that include the handler function for
// each endpoint.
const getLambdas = () => {
  const serverlessConfig = getServerlessConfig()
  return getLambdasFromServerlessConfig(serverlessConfig)
}

export default getLambdas
