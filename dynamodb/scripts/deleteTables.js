/* eslint no-console: 0 */
import AWS from '../aws-client'
import confirmCommand from './confirmCommand'
import getTableInfo from './getTableInfo'

const dynamodb = new AWS.DynamoDB()

const tables = getTableInfo()

const deleteTable = tableConfig => {
  const params = {
    TableName: tableConfig.TableName,
  }
  dynamodb.deleteTable(params, err => {
    if (err) {
      console.error(
        `Unable to delete table "${
          tableConfig.TableName
        }". Error JSON: ${JSON.stringify(err, null, 2)}`
      )
    } else {
      console.log(`Deleted table "${tableConfig.TableName}".`)
    }
  })
}

confirmCommand(() => {
  tables.forEach(table => deleteTable(table))
})
