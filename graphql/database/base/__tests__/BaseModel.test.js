/* eslint-env jest */

import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import { DatabaseOperation, setMockDBResponse } from '../../test-utils'

jest.mock('../../databaseClient')

describe('BaseModel queries', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('correctly fetches with `getAll` method', async () => {
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.GET_ALL,
      {
        Items: fixturesA
      }
    )
    const expectedDBParams = {
      TableName: ExampleModel.tableName
    }
    const response = await ExampleModel.getAll()
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response.length).toBe(fixturesA.length)
    for (var index in response) {
      expect(response[index]).toEqual(fixturesA[index])
    }
  })

  it('correctly fetches with `get` method for a model with no range key', async () => {
    const itemToGet = fixturesA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: itemToGet
      }
    )
    const expectedDBParams = {
      TableName: ExampleModel.tableName,
      Key: {
        id: itemToGet.id
      }
    }
    const response = await ExampleModel.get(itemToGet.id)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemToGet)
  })

  // TODO: `get` with a range key
})

describe('BaseModel required properties', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('fails if "name" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.name
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "hashKey" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.hashKey
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "tableName" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.tableName
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('fails if "schema" property is not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.schema
    expect(() => {
      TestModel.register()
    }).toThrow()
  })

  it('succeeds normally', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    expect(() => {
      TestModel.register()
    }).not.toThrow()
  })
})
