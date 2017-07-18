/** @module database */

import { DBLogger } from '../utils/dev-tools'
import config from '../config'

var AWS = require('aws-sdk')

AWS.config.update({
  region: config.AWS_REGION,
  endpoint: config.DYNAMODB_ENDPOINT
})

var dynamoDb = new AWS.DynamoDB.DocumentClient()

/** Dynamo DB wrapper. */
var database = {}

/**
 * Represents a put operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.put = function (params) {
  DBLogger.action('put', params)
  return dynamoDb.put(params).promise()
            .then(data => {
              DBLogger.response('put', data)
              return data
            })
}

/**
 * Represents a get operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.get = function (params) {
  DBLogger.action('get', params)
  return dynamoDb.get(params).promise()
            .then(data => {
              DBLogger.response('get', data)
              return data
            })
}

/**
 * Represents a batchGet operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.batchGet = function (params) {
  DBLogger.action('batchGet', params)
  return dynamoDb.batchGet(params).promise()
            .then(data => {
              DBLogger.response('get', data)
              return data
            })
}

/**
 * Represents a query operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.query = function (params) {
  DBLogger.action('query', params)
  return dynamoDb.query(params).promise()
            .then(data => {
              DBLogger.response('query', data)
              return data
            })
}

/**
 * Represents a scan operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.scan = function (params) {
  DBLogger.action('scan', params)
  return dynamoDb.scan(params).promise()
            .then(data => {
              DBLogger.response('scan', data)
              return data
            })
}

/**
 * Represents an update operation.
 * @param {Object} params - the query parameters.
 * @return {Promise<Object>} A promise that resolve
 * into the response data.
 */
database.update = function (params) {
  DBLogger.action('update', params)
  return dynamoDb.update(params).promise()
  .then(data => {
    DBLogger.response('update', data)
    return data
  })
}

/** Dynamo DB wrapper. */
export default database
