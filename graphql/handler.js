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

export const handler = function (event, context) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }

  console.log('----- Cognito Authorizer claims -----')
  console.log('sub', context.authorizer.claims['sub'])
  console.log('email_verified', context.authorizer.claims['email_verified'])
  console.log('cognito:username', context.authorizer.claims['cognito:username'])
  return graphql(Schema, body.query, null, {}, body.variables)
    .then(data => createResponse(200, data))
    .catch(err => createResponse(500, err))
}

export const serverlessHandler = function (event, context, callback) {
  handler(event, context)
    .then(response => callback(null, response))
}
