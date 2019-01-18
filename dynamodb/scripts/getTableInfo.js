import fs from "fs";
import path from "path";
import { map } from "lodash/collection";
import { cloneDeep } from "lodash/lang";

const tablesJsonFile = "tables.json";
const tablesInfoRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../${tablesJsonFile}`), "utf8")
);

const getTableInfo = function() {
  // Add an appendix to the table name if required.
  const tableNameAppendix = process.env.DB_TABLE_NAME_APPENDIX
    ? process.env.DB_TABLE_NAME_APPENDIX
    : "";

  return map(tablesInfoRaw, tableInfo => {
    const newTableInfo = cloneDeep(tableInfo);
    newTableInfo.TableName = `${newTableInfo.TableName}${tableNameAppendix}`;
    return newTableInfo;
  });
};

export default getTableInfo;
