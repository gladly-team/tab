
import fs from 'fs';
import path from 'path';

import AWS from '../aws-client';
import confirmCommand from './confirmCommand';
const docClient = new AWS.DynamoDB.DocumentClient();

function loadTable(fixture) {
  const tableName = fixture.tableName;
  const jsonFile = path.join(__dirname, '../fixtures/', fixture.jsonFile);
  console.log(`Loading ${tableName} table data from ${jsonFile}.`);

  const items = JSON.parse(fs.readFileSync(jsonFile), 'utf8');
  items.forEach(function(item) {
      const params = {
          TableName: tableName,
          Item: item
      };

      docClient.put(params, function(err, data) {
         if (err) {
             console.error(`Unable to add item ${JSON.stringify(item)}. Error JSON: ${JSON.stringify(err, null, 2)}`);
         } else {
             console.log(`PutItem succeeded: ${JSON.stringify(item)}`);
         }
      });
  });
}

const fixtures = [
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

confirmCommand(() => {
  console.log('Importing tables into DynamoDB. Please wait.');
  fixtures.forEach((fixture) => loadTable(fixture))
})
