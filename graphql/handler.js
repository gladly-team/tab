'use strict'

import { graphql } from 'graphql'
import { Schema } from './data/schema'

const createResponse = function (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
}

export const handler = function (event) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }

  console.log('----- Cognito Authorizer claims -----')
  console.log(JSON.stringify(event.requestContext, null, 2))
  console.log('sub', event.requestContext.authorizer['sub'])
  console.log('email_verified', event.requestContext.authorizer['email_verified'])
  console.log('cognito:username', event.requestContext.authorizer['cognito:username'])
  return graphql(Schema, body.query, null, {}, body.variables)
    .then(data => createResponse(200, data))
    .catch(err => createResponse(500, err))
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
