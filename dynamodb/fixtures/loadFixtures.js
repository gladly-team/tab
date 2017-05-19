
var fs = require('fs');

var AWS = require('../aws-client');
var docClient = new AWS.DynamoDB.DocumentClient();
var confirmCommand = require('../confirmCommand');

function loadTable(fixture) {
  var tableName = fixture.tableName;
  var jsonFile = fixture.jsonFile;
  console.log('Loading ' + tableName + ' table data from ' + jsonFile);

  var items = JSON.parse(fs.readFileSync(__dirname + '/' + jsonFile, 'utf8'));
  items.forEach(function(item) {
      var params = {
          TableName: tableName,
          Item: item
      };

      docClient.put(params, function(err, data) {
         if (err) {
             console.error('Unable to add item', item, '. Error JSON:', JSON.stringify(err, null, 2));
         } else {
             console.log('PutItem succeeded:', item);
         }
      });
  });
}

var fixtures = [
  {
    tableName: 'Users',
    jsonFile: 'UserData.json'
  },
  {
    tableName: 'Charities',
    jsonFile: 'CharityData.json'
  },
  {
    tableName: 'Features',
    jsonFile: 'FeatureData.json'
  },
  {
    tableName: 'UserLevels',
    jsonFile: 'UserLevels.json'
  },
  {
    tableName: 'VcDonationLog',
    jsonFile: 'VcDonationLog.json'
  },
  {
    tableName: 'BackgroundImages',
    jsonFile: 'BackgroundImages.json'
  },
  {
    tableName: 'Widgets',
    jsonFile: 'WidgetsData.json'
  },
  {
    tableName: 'UserWidgets',
    jsonFile: 'UserWidgetsData.json'
  }
];

confirmCommand(function() {
  console.log('Importing tables into DynamoDB. Please wait.');

  fixtures.forEach(function(fixture) {
    loadTable(fixture);
  });
})
