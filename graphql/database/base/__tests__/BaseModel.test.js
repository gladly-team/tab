/* eslint-env jest */

import { filter } from 'lodash/collection'
import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import { DatabaseOperation, setMockDBResponse } from '../../test-utils'

jest.mock('../../databaseClient')

const user = {
  id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
  username: 'MyName',
  emailVerified: true
}

describe('BaseModel methods', () => {
  afterEach(() => {
    jest.clearAllMocks()

    // For some reason, jest.resetModules is failing with
    // ExampleModel (even when using CommonJS requires), so just
    // reset permissions manually.
    Object.defineProperty(ExampleModel, 'permissions', {
      get: () => ({
        get: () => false,
        getAll: () => false,
        update: () => false,
        create: () => false
      })
    })
  })

  it('correctly fetches with `getAll` method', async () => {
    // Set model permissions.
    Object.defineProperty(ExampleModel, 'permissions', {
      get: () => ({
        getAll: () => true
      })
    })

    // Set mock response from DB client.
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.GET_ALL,
      {
        Items: fixturesA
      }
    )
    const expectedDBParams = {
      TableName: ExampleModel.tableName
    }
    const response = await ExampleModel.getAll(user)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response.length).toBe(fixturesA.length)
    for (var index in response) {
      expect(response[index]).toEqual(fixturesA[index])
    }
  })

  it('correctly fetches with `get` method for a model with no range key', async () => {
    // Set model permissions.
    Object.defineProperty(ExampleModel, 'permissions', {
      get: () => ({
        get: () => true
      })
    })

    // Set mock response from DB client.
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
    const response = await ExampleModel.get(user, itemToGet.id)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemToGet)
  })

  it('deserializes to the correct instance type', () => {
    const item = fixturesA[0]
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem instanceof ExampleModel).toBe(true)
  })

  // TODO: `get` with a range key
  // TODO: deserialization with default fields
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

describe('BaseModel authorization', () => {
  afterEach(() => {
    jest.resetModules()
  })

  const validOperations = [
    'get',
    'getAll',
    'update',
    'create'
  ]

  it('does not authorize if permissions are not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    delete TestModel.permissions
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if operation properties are not set', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    Object.defineProperty(TestModel, 'permissions', {
      get: () => { return {} }
    })
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if operation properties are not functions', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    const newPermissions = validOperations.reduce((result, item) => {
      result[item] = 'hi'
      return result
    }, {})
    Object.defineProperty(TestModel, 'permissions', {
      get: () => newPermissions
    })
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })

  it('authorizes all operations if each returns true', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    const newPermissions = validOperations.reduce((result, item) => {
      result[item] = () => true
      return result
    }, {})
    Object.defineProperty(TestModel, 'permissions', {
      get: () => newPermissions
    })
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(true)
    })
  })

  it('one permission is authorized but others are not', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    const newPermissions = {
      update: () => true
    }
    Object.defineProperty(TestModel, 'permissions', {
      get: () => newPermissions
    })

    // Update operation should be authorized.
    const isUpdateAuthorized = TestModel.isQueryAuthorized(
      user, 'update', 'fake-hash-key', 'fake-range-key')
    expect(isUpdateAuthorized).toBe(true)

    // All other operations should not be authorized.
    const otherOperations = filter(validOperations, (item) => item !== 'update')
    otherOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if the user is not defined', () => {
    const TestModel = require('../test-utils/ExampleModel').default

    // Make the model permissions to allow operations.
    const newPermissions = validOperations.reduce((result, item) => {
      result[item] = () => true
      return result
    }, {})
    Object.defineProperty(TestModel, 'permissions', {
      get: () => newPermissions
    })

    // All operations should fail without a user.
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(null, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if the user is not an object', () => {
    const TestModel = require('../test-utils/ExampleModel').default

    // Make the model permissions to allow operations.
    const newPermissions = validOperations.reduce((result, item) => {
      result[item] = () => true
      return result
    }, {})
    Object.defineProperty(TestModel, 'permissions', {
      get: () => newPermissions
    })

    // All operations should fail without a user.
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(
        'bad-user-value', operation, 'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })
})
