
import fs from 'fs';
import path from 'path';

import AWS from '../aws-client';
import confirmCommand from './confirmCommand';
const dynamodb = new AWS.DynamoDB();

const tablesJsonFile = 'tables.json';
const tables = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../' + tablesJsonFile),
  'utf8'));

function createOrUpdateTable(tableConfig) {

  const describeParams = {
    TableName: tableConfig.TableName
  };

  // First check if table exists.
  dynamodb.describeTable(describeParams, (err, tableDescription) => {

    // Table does not exist, so create it.
    if (err && err.code === 'ResourceNotFoundException') {
      dynamodb.createTable(tableConfig, function(err, data) {
        if (err) {
          console.error(`Unable to create table "${tableConfig.TableName}". Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Created table "${tableConfig.TableName}". Table description JSON: ${JSON.stringify(data, null, 2)}`);
        }
      });

    // Table exists, so update it.
    } else {

      // Only include update-able properties.      
      const updateParams = {
        TableName: tableConfig.TableName,
        AttributeDefinitions: tableConfig.AttributeDefinitions,
        GlobalSecondaryIndexUpdates: tableConfig.GlobalSecondaryIndexUpdates,
        StreamSpecification: tableConfig.StreamSpecification,
      };

      // Only include ProvisionedThroughput if it's changed.
      // Identical values will throw a ValidationException when calling `updateTable`.
      if (!tableDescription && tableConfig.ProvisionedThroughput) {
        updateParams.ProvisionedThroughput = tableConfig.ProvisionedThroughput;
      } else {
        const oldTableConfig = tableDescription.Table.ProvisionedThroughput;
        const newTableConfig = tableConfig.ProvisionedThroughput;
        if (
          oldTableConfig.ReadCapacityUnits !== newTableConfig.ReadCapacityUnits ||
          oldTableConfig.WriteCapacityUnits !== newTableConfig.WriteCapacityUnits) {
            updateParams.ProvisionedThroughput = newTableConfig;
        }
      }

      dynamodb.updateTable(updateParams, function(err, data) {
        if (err && err.code == 'ValidationException') {
          console.error(`Did not update table "${tableConfig.TableName}". Nothing changed.`);
        } else if (err) {
          console.error(`Unable to update table "${tableConfig.TableName}". Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
          console.log(`Updated table "${tableConfig.TableName}". Table description JSON: ${JSON.stringify(data, null, 2)}`);
        }
      });
    }
  }); 
}

confirmCommand(() => {
  tables.forEach((table) => createOrUpdateTable(table));
});

