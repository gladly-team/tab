/* eslint-env jest */

import { filter } from 'lodash/collection'
import {
  getMockUserObj,
  setModelPermissions
} from '../../test-utils'

jest.mock('../../databaseClient')

const user = getMockUserObj()

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
