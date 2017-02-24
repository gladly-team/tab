'use strict';

var AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

var database = {};

database.put = function(params) {
  return dynamoDb.put(params).promise();
};

database.get = function(params) {
  return dynamoDb.get(params).promise();
};

module.exports = database;
