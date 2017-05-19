
import fs from 'fs';
import path from 'path';
import { map } from 'lodash/collection';


const tablesJsonFile = 'tables.json';
const tablesInfoRaw = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../' + tablesJsonFile),
  'utf8'));

// Add an appendix to the table name if required.
const tableNameAppendix = (
  process.env.TABLE_NAME_APPENDIX ?
  process.env.TABLE_NAME_APPENDIX :
  ''
);

const getTableInfo = function() {
  return map(tablesInfoRaw, (tableInfo) => {
    tableInfo.TableName = `${tableInfo.TableName}${tableNameAppendix}`;
    return tableInfo;
  });
};

export default getTableInfo;
