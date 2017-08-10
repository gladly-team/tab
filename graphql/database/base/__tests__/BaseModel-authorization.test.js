/* eslint-env jest */

import { filter } from 'lodash/collection'
import {
  getMockUserContext,
  setModelPermissions
} from '../../test-utils'

jest.mock('../../databaseClient')

const user = getMockUserContext()

describe('BaseModel `isQueryAuthorized` method', () => {
  beforeEach(() => {
    // Mock a valid permissions override.
    jest.mock('../../../utils/authorization-helpers', () => {
      return {
        isValidPermissionsOverride: jest.fn((override) => {
          return override === 'working-override'
        })
      }
    })
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

    // Make the model permissions allow operations.
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

    // Make the model permissions allow operations.
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

  it('authorizes with a valid permissions override', () => {
    const TestModel = require('../test-utils/ExampleModel').default

    // Make the model disallow all operations.
    const newPermissions = validOperations.reduce((result, item) => {
      result[item] = () => false
      return result
    }, {})
    setModelPermissions(TestModel, newPermissions)

    validOperations.forEach((operation) => {
      const isAuthorized = TestModel.isQueryAuthorized(
        'working-override', operation, 'fake-hash-key', 'fake-range-key')
      expect(isAuthorized).toBe(true)
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
    const item = {
      id: hashKeyVal,
      name: 'thing'
    }
    await TestModel.create(user, item)
      .catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'create', hashKeyVal, null, item)
  })

  it('passes correct params to `update` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelRangeKey').default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'xy5082cc-151a-4a9a-9289-06906670fd4e'
    const rangeKeyVal = '30'
    const item = {
      [TestModelRangeKey.hashKey]: hashKeyVal,
      [TestModelRangeKey.rangeKey]: rangeKeyVal
    }
    await TestModelRangeKey.update(user, item)
    .catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'update',
      hashKeyVal, rangeKeyVal, item)
  })
})
