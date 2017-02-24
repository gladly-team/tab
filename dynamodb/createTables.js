
var fs = require('fs');

var AWS = require('./aws-client');
var dynamodb = new AWS.DynamoDB();

var tablesJsonFile = 'tables.json';
var tables = JSON.parse(fs.readFileSync(__dirname + '/' + tablesJsonFile, 'utf8'));

function createTable(tableConfig) {
  dynamodb.createTable(tableConfig, function(err, data) {
    if (err) {
      console.error('Unable to create table "' + tableConfig.TableName + '". Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table "' + tableConfig.TableName + '". Table description JSON:', JSON.stringify(data, null, 2));
    }
  });
}

tables.forEach(function(table) {
  console.log('Creating table "' + table.TableName + '"...');
  createTable(table);
});
