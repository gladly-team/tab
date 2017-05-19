
import fs from 'fs';
import path from 'path';

import AWS from '../aws-client';
import confirmCommand from './confirmCommand';
const dynamodb = new AWS.DynamoDB();

const tablesJsonFile = 'tables.json';
const tables = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../' + tablesJsonFile),
  'utf8'));

const deleteTable = function(tableConfig) {
  const params = {
    TableName: tableConfig.TableName
  };
  dynamodb.deleteTable(params, (err, data) => {
    if (err) {
      console.error(`Unable to delete table "${tableConfig.TableName}". Error JSON: ${JSON.stringify(err, null, 2)}`);
    } else {
      console.log(`Deleted table "${tableConfig.TableName}".`);
    }
  });
}

confirmCommand(() => {
  tables.forEach((table) => deleteTable(table));
});
