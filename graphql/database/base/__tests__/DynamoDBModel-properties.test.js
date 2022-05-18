/* eslint-env jest */

jest.mock('../../databaseClient')

describe('DynamoDBModel required properties', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('fails if "tableName" property is not set', () => {
    const TestModel = require('../test-utils/ExampleDynamoDBModel').default
    delete TestModel.tableName
    expect(() => {
      TestModel.register()
    }).toThrow()
  })
})
