import config from '../config/environment';

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
  return dynamoDb.put(params).promise();
};

database.get = function(params) {
  return dynamoDb.get(params).promise();
};

database.scan = function(params) {
  return dynamoDb.scan(params).promise();
};

database.update = function(params) {
  return dynamoDb.update(params).promise();
};

module.exports = database;