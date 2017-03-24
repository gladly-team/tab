'use strict';

var AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeKey123',
  secretAccessKey: 'fakeSecretKey456'
});
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var database = {};

database.put = function(params) {
  return dynamoDb.put(params).promise();
};

database.get = function(params) {
  return dynamoDb.get(params).promise();
};

module.exports = database;
