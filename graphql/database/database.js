import config from '../config/environment';

const logger = {
  action: (action, params) => {
    console.log(`Received action: ${action} with params: `, params);
  },
  response: (action, data) => {
    console.log(`Response from action: ${action}: `, data);
  }
}

var AWS = require('aws-sdk');

AWS.config.update({
  region: config.dynamoDB.region,
  endpoint: config.dynamoDB.endpoint,
  accessKeyId: config.dynamoDB.accessKeyId,
  secretAccessKey: config.dynamoDB.secretAccessKey
});

var dynamoDb = new AWS.DynamoDB.DocumentClient();

// Dynamo DB wrapper.
var database = {};

database.put = function(params) {
  logger.action('put', params);
  return dynamoDb.put(params).promise()
            .then(data => {
              logger.response('put', data);
              return data;
            });
};

database.get = function(params) {
  logger.action('get', params);
  return dynamoDb.get(params).promise()
            .then(data => {
              logger.response('get', data);
              return data;
            });
};

database.batchGet = function(params) {
  logger.action('get', params);
  return dynamoDb.batchGet(params).promise()
            .then(data => {
              logger.response('get', data);
              return data;
            });
};

database.query = function(params) {
  logger.action('query', params);
  return dynamoDb.query(params).promise()
            .then(data => {
              logger.response('query', data);
              return data;
            });
};

database.scan = function(params) {
  logger.action('scan', params);
  return dynamoDb.scan(params).promise()
            .then(data => {
              logger.response('scan', data);
              return data;
            });

};

database.update = function(params) {
  logger.action('update', params);
  return dynamoDb.update(params).promise()
  .then(data => {
    logger.response('update', data);
    return data;
  });
  return ;
};

module.exports = database;