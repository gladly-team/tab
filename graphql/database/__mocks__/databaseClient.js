/* eslint-env jest */

const AWS = require('aws-sdk')

// From:
// https://github.com/clarkie/dynogels/blob/d8e265eea3826ef6268e6c242854b1a09d15124c/test/test-helper.js#L8
const mockDynamoDB = () => {
  const opts = {
    endpoint: 'http://localhost:8000'
  }
  const db = new AWS.DynamoDB(opts)

  db.scan = jest.fn()
  db.putItem = jest.fn()
  db.deleteItem = jest.fn()
  db.query = jest.fn()
  db.getItem = jest.fn()
  db.updateItem = jest.fn()
  db.createTable = jest.fn()
  db.describeTable = jest.fn()
  db.updateTable = jest.fn()
  db.deleteTable = jest.fn()
  db.batchGetItem = jest.fn()
  db.batchWriteItem = jest.fn()

  return db
}

const mockDocClient = () => {
  const client = new AWS.DynamoDB.DocumentClient({
    service: mockDynamoDB(),
    convertEmptyValues: true
  })

  // Mock data returns for each operation.

  client.batchGet = jest.fn((params, callback) => {
    callback(null, {
      Items: [
        {
          foo: 'bar'
        },
        {
          'foo': 'baz'
        }
      ]
    })
  })
  client.batchWrite = jest.fn((params, callback) => {
    callback(null, {
      Attributes: {}
    })
  })
  client.put = jest.fn((params, callback) => {
    callback(null, {
      Attributes: {}
    })
  })
  client.get = jest.fn((params, callback) => {
    callback(null, {
      Item: {
        foo: 'bar'
      }
    })
  })
  client.delete = jest.fn((params, callback) => {
    callback(null, {
      Attributes: {}
    })
  })
  client.update = jest.fn((params, callback) => {
    callback(null, {
      Item: {
        foo: 'bar'
      }
    })
  })
  client.scan = jest.fn((params, callback) => {
    callback(null, {
      Items: [
        {
          foo: 'bar'
        },
        {
          'foo': 'baz'
        }
      ]
    })
  })
  client.query = jest.fn((params, callback) => {
    callback(null, {
      Items: [
        {
          foo: 'bar'
        },
        {
          'foo': 'baz'
        }
      ]
    })
  })

  client.service.scan = jest.fn()
  client.service.putItem = jest.fn()
  client.service.deleteItem = jest.fn()
  client.service.query = jest.fn()
  client.service.getItem = jest.fn()
  client.service.updateItem = jest.fn()
  client.service.createTable = jest.fn()
  client.service.describeTable = jest.fn()
  client.service.updateTable = jest.fn()
  client.service.deleteTable = jest.fn()
  client.service.batchGetItem = jest.fn()
  client.service.batchWriteItem = jest.fn()

  return client
}

export default mockDocClient()
