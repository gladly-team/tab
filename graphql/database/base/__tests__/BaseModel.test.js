/* eslint-env jest */

import { filter } from 'lodash/collection'
import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import ExampleModelRangeKey, {
  fixturesRangeKeyA
} from '../test-utils/ExampleModelRangeKey'
import {
  DatabaseOperation,
  setMockDBResponse,
  setModelPermissions
} from '../../test-utils'
import {
  UnauthorizedQueryException
} from '../../../utils/exceptions'

jest.mock('../../databaseClient')

const user = {
  id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
  username: 'MyName',
  emailVerified: true
}

describe('BaseModel queries', () => {
  afterEach(() => {
    jest.clearAllMocks()

    // For some reason, jest.resetModules is failing with
    // ExampleModel (even when using CommonJS requires), so just
    // reset permissions manually.
    setModelPermissions(ExampleModel, {
      get: () => false,
      getAll: () => false,
      update: () => false,
      create: () => false
    })
  })

  it('correctly fetches with `getAll` method', async () => {
    setModelPermissions(ExampleModel, {
      getAll: () => true
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

  it('fails with unauthorized `getAll`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      getAll: () => false
    })
    return expect(ExampleModel.getAll(user))
      .rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly fetches with `get` method for a model with no range key', async () => {
    setModelPermissions(ExampleModel, {
      get: () => true
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

  it('correctly handles a `get` that returns no item', async () => {
    setModelPermissions(ExampleModel, {
      get: () => true
    })

    // Set mock response from DB client.
    const itemToGet = fixturesA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: null
      }
    )
    const response = await ExampleModel.get(user, itemToGet.id)
    expect(response).toEqual(null)
  })

  it('correctly uses `get` method for a model with a range key', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      get: () => true
    })

    // Set mock response from DB client.
    const itemToGet = fixturesRangeKeyA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: itemToGet
      }
    )
    const expectedDBParams = {
      TableName: ExampleModelRangeKey.tableName,
      Key: {
        id: itemToGet.id,
        age: itemToGet.age
      }
    }
    const response = await ExampleModelRangeKey.get(user, itemToGet.id, itemToGet.age)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemToGet)
  })

  it('fails with unauthorized `get`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      get: () => false
    })
    const itemToGet = fixturesA[0]
    return expect(ExampleModel.get(user, itemToGet.id))
      .rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly creates item', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true
    })

    // Set mock response from DB client.
    const itemToCreate = fixturesA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        // https://docs.aws.amazon.com/cli/latest/reference/dynamodb/put-item.html#output
        Attributes: {}
      }
    )
    const createdItem = await ExampleModel.create(user, itemToCreate)

    // Verify form of DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.TableName).toEqual(ExampleModel.tableName)
    expect(dbParams.Item.id).toEqual(itemToCreate.id)
    expect(dbParams.Item.created).toBeDefined()

    // Verify form of created object.
    expect(createdItem.id).toEqual(itemToCreate.id)
    expect(createdItem.created).toBeDefined()
  })

  it('correctly creates item with default fields', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true
    })

    // Set mock response from DB client.
    const itemToCreate = {}
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const createdItem = await ExampleModel.create(user, itemToCreate)

    // Verify form of DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.TableName).toEqual(ExampleModel.tableName)
    expect(dbParams.Item.id).toBeDefined()
    expect(dbParams.Item.name).toEqual(ExampleModel.fieldDefaults.name)
    expect(dbParams.Item.created).toBeDefined()

    // Verify form of created object.
    expect(createdItem.id).toBeDefined()
    expect(createdItem.name).toEqual(ExampleModel.fieldDefaults.name)
    expect(createdItem.created).toBeDefined()
  })

  it('fails with unauthorized `create`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      create: () => false
    })
    const itemToCreate = fixturesA[0]
    return expect(ExampleModel.create(user, itemToCreate))
      .rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly updates item', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true
    })

    // Set mock response from DB client.
    const itemToUpdate = fixturesA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: itemToUpdate
      }
    )
    const updatedItem = await ExampleModel.update(user, itemToUpdate)

    // Verify form of DB params.
    // {
    //   TableName: 'ExamplesTable',
    //   Key: { id: 'ab5082cc-151a-4a9a-9289-06906670fd4e' },
    //   ReturnValues: 'ALL_NEW',
    //   ExpressionAttributeValues: { ':name': 'Thing A', ':updated': '2017-07-28T21:11:12.215Z' },
    //   ExpressionAttributeNames: { '#name': 'name', '#updated': 'updated' },
    //   UpdateExpression: 'SET #name = :name, #updated = :updated'
    // }
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.TableName).toEqual(ExampleModel.tableName)
    expect(dbParams.Key.id).toEqual(itemToUpdate.id)
    expect(dbParams.ReturnValues).toEqual('ALL_NEW')
    expect(dbParams.ExpressionAttributeValues[':name']).toBe(itemToUpdate.name)
    expect(dbParams.ExpressionAttributeValues[':updated']).toBeDefined()
    expect(dbParams.UpdateExpression).toBe('SET #name = :name, #updated = :updated')

    // Verify form of returned object.
    expect(updatedItem.id).toEqual(itemToUpdate.id)
    // The "created" field is not set for an updated item. Fix this?
    // expect(updatedItem.created).toBeDefined()
    expect(updatedItem.updated).toBeDefined()
  })

  it('correctly updates item with a range key', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      update: () => true
    })

    // Set mock response from DB client.
    const itemToUpdate = fixturesRangeKeyA[0]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: itemToUpdate
      }
    )
    const updatedItem = await ExampleModelRangeKey.update(user, itemToUpdate)

    // Verify form of DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.TableName).toEqual(ExampleModelRangeKey.tableName)
    expect(dbParams.Key.id).toEqual(itemToUpdate.id)
    expect(dbParams.Key.age).toBeDefined()
    expect(dbParams.Key.age).toEqual(itemToUpdate.age)
    expect(dbParams.ExpressionAttributeValues[':name']).toBe(itemToUpdate.name)
    expect(dbParams.ExpressionAttributeValues[':updated']).toBeDefined()
    expect(dbParams.UpdateExpression).toBe('SET #name = :name, #updated = :updated')

    // Verify form of returned object.
    expect(updatedItem.id).toEqual(itemToUpdate.id)
    expect(updatedItem.age).toBeDefined()
    expect(updatedItem.age).toEqual(itemToUpdate.age)
    expect(updatedItem.updated).toBeDefined()
  })

  it('fails with unauthorized `update`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      update: () => false
    })
    const itemToUpdate = fixturesA[0]
    return expect(ExampleModel.update(user, itemToUpdate))
      .rejects.toEqual(new UnauthorizedQueryException())
  })
})

describe('BaseModel deserialization', () => {
  it('deserializes to the correct instance type', () => {
    const item = {
      attrs: fixturesA[0]
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem instanceof ExampleModel).toBe(true)
  })

  it('deserializes correctly', () => {
    const item = {
      attrs: {
        id: 'yy5082cc-151a-4a9a-9289-06906670fd4e',
        name: 'Jim Bond'
      }
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('yy5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe('Jim Bond')
  })

  it('deserializes to include default values', () => {
    const item = {
      attrs: {
        id: 'zb5082cc-151a-4a9a-9289-06906670fd4e'
      }
    }
    const deserializedItem = ExampleModel.deserialize(item)
    expect(deserializedItem.id).toBe('zb5082cc-151a-4a9a-9289-06906670fd4e')
    expect(deserializedItem.name).toBe(ExampleModel.fieldDefaults.name)
  })
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

describe('BaseModel calls to `isQueryAuthorized`', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('passes correct params to `getAll` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModel').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    await TestModel.getAll(user)
      .catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'getAll')
  })

  it('passes correct params to `get` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelRangeKey').default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'cb5082cc-151a-4a9a-9289-06906670fd4e'
    const rangeKeyVal = '45'
    await TestModelRangeKey.get(user, hashKeyVal, rangeKeyVal)
      .catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'get',
      hashKeyVal, rangeKeyVal)
  })

  it('passes correct params to `create` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModel').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'yx5082cc-151a-4a9a-9289-06906670fd4e'
    await TestModel.create(user, {id: hashKeyVal, name: 'thing'}).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'create', hashKeyVal)
  })

  it('passes correct params to `update` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelRangeKey').default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'xy5082cc-151a-4a9a-9289-06906670fd4e'
    const rangeKeyVal = '30'
    await TestModelRangeKey.update(user, {
      [TestModelRangeKey.hashKey]: hashKeyVal,
      [TestModelRangeKey.rangeKey]: rangeKeyVal
    }).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'update',
      hashKeyVal, rangeKeyVal)
  })
})

describe('BaseModel `isQueryAuthorized` method', () => {
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
    setModelPermissions(TestModel, {})
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
    setModelPermissions(TestModel, newPermissions)
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
    setModelPermissions(TestModel, newPermissions)
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(user, operation,
        'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(true)
    })
  })

  it('works if one permission is authorized but others are not', () => {
    const TestModel = require('../test-utils/ExampleModel').default
    setModelPermissions(TestModel, {
      update: () => true
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
    setModelPermissions(TestModel, newPermissions)

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
    setModelPermissions(TestModel, newPermissions)

    // All operations should fail without a user.
    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(
        'bad-user-value', operation, 'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(false)
    })
  })
})
