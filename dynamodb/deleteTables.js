
var fs = require('fs');

var AWS = require('./aws-client');
var dynamodb = new AWS.DynamoDB();
var confirmCommand = require('./confirmCommand');

var tablesJsonFile = 'tables.json';
var tables = JSON.parse(fs.readFileSync(__dirname + '/' + tablesJsonFile, 'utf8'));

function deleteTable(tableConfig) {
  var params = {
    TableName: tableConfig.TableName
  };
  dynamodb.deleteTable(params, function(err, data) {
    if (err) {
      console.error('Unable to delete table "' + tableConfig.TableName + '". Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Deleted table "' + tableConfig.TableName + '".');
    }
  });
}

confirmCommand(function() {
  tables.forEach(function(table) {
    deleteTable(table);
  });
});
