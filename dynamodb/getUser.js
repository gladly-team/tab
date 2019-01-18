// This file is just an example.

const AWS = require('./aws-client')

const docClient = new AWS.DynamoDB.DocumentClient()

const table = 'Users'

const userId = 3

const params = {
  TableName: table,
  Key: {
    UserId: userId,
  },
}

docClient.get(params, (err, data) => {
  if (err) {
    console.error(
      'Unable to read item. Error JSON:',
      JSON.stringify(err, null, 2)
    )
  } else {
    console.log('GetItem succeeded:', JSON.stringify(data, null, 2))
  }
})
