/* eslint-env jest */

import { filter } from 'lodash/collection'
import { getMockUserContext, setModelPermissions } from '../../test-utils'

jest.mock('../../databaseClient')

const user = getMockUserContext()

describe('BaseModel `isQueryAuthorized` method', () => {
  beforeEach(() => {
    // Mock a valid permissions override.
    jest.mock('../../../utils/permissions-overrides', () => ({
      isValidPermissionsOverride: jest.fn(
        override => override === 'working-override'
      ),
    }))
    jest.resetModules()
  })

  const validOperations = ['get', 'getAll', 'update', 'create']

  it('does not authorize if permissions are not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    delete TestModel.permissions
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        user,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if operation properties are not set', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    setModelPermissions(TestModel, {})
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        user,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if operation properties are not functions', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    const newPermissions = validOperations.reduce(
      (result, item) =>
        Object.assign({}, result, {
          [item]: 'hi',
        }),
      {}
    )
    setModelPermissions(TestModel, newPermissions)
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        user,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('authorizes all operations if each returns true', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    const newPermissions = validOperations.reduce(
      (result, item) =>
        Object.assign({}, result, {
          [item]: () => true,
        }),
      {}
    )
    setModelPermissions(TestModel, newPermissions)
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        user,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(true)
    })
  })

  it('works if one permission is authorized but others are not', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    setModelPermissions(TestModel, {
      update: () => true,
    })

    // Update operation should be authorized.
    const isUpdateAuthorized = TestModel.isQueryAuthorized(
      user,
      'update',
      'fake-hash-key',
      'fake-range-key'
    )
    expect(isUpdateAuthorized).toBe(true)

    // All other operations should not be authorized.
    const otherOperations = filter(validOperations, item => item !== 'update')
    otherOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        user,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if the user is not defined', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default

    // Make the model permissions allow operations.
    const newPermissions = validOperations.reduce(
      (result, item) =>
        Object.assign({}, result, {
          [item]: () => true,
        }),
      {}
    )
    setModelPermissions(TestModel, newPermissions)

    // All operations should fail without a user.
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        null,
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('does not authorize if the user is not an object', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default

    // Make the model permissions allow operations.
    const newPermissions = validOperations.reduce(
      (result, item) =>
        Object.assign({}, result, {
          [item]: () => true,
        }),
      {}
    )
    setModelPermissions(TestModel, newPermissions)

    // All operations should fail without a user.
    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        'bad-user-value',
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(false)
    })
  })

  it('authorizes with a valid permissions override', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default

    // Make the model disallow all operations.
    const newPermissions = validOperations.reduce(
      (result, item) =>
        Object.assign({}, result, {
          [item]: () => false,
        }),
      {}
    )
    setModelPermissions(TestModel, newPermissions)

    validOperations.forEach(operation => {
      const isAuthorized = TestModel.isQueryAuthorized(
        'working-override',
        operation,
        'fake-hash-key',
        'fake-range-key'
      )
      expect(isAuthorized).toBe(true)
    })
  })

  it('does not allow a query on a secondary index if that index is not in permissions', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    setModelPermissions(TestModel, {
      get: () => true,
    })

    // Update operation should be authorized.
    const isUpdateAuthorized = TestModel.isQueryAuthorized(
      user,
      'get',
      'fake-hash-key',
      null,
      null,
      'MySecondaryIndex'
    )
    expect(isUpdateAuthorized).toBe(false)
  })

  it('does not allow a query on a secondary index if that index is not named in permissions', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    setModelPermissions(TestModel, {
      get: () => true,
      indexPermissions: {
        AnotherIndexName: {
          get: () => true,
        },
      },
    })

    // Update operation should be authorized.
    const isUpdateAuthorized = TestModel.isQueryAuthorized(
      user,
      'get',
      'fake-hash-key',
      null,
      null,
      'MySecondaryIndex'
    )
    expect(isUpdateAuthorized).toBe(false)
  })

  it('allows a query on a secondary index if that index is given permissions', () => {
    const TestModel = require('../test-utils/ExampleModelV2').default
    setModelPermissions(TestModel, {
      get: () => true,
      indexPermissions: {
        MySecondaryIndex: {
          get: () => true,
        },
      },
    })

    // Update operation should be authorized.
    const isUpdateAuthorized = TestModel.isQueryAuthorized(
      user,
      'get',
      'fake-hash-key',
      null,
      null,
      'MySecondaryIndex'
    )
    expect(isUpdateAuthorized).toBe(true)
  })
})

describe('BaseModel calls to `isQueryAuthorized`', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('passes correct params to `getAll` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModelV2').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    await TestModel.getAll(user).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(user, 'getAll')
  })

  it('passes correct params to `get` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelV2RangeKey')
      .default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'cb5082cc-151a-4a9a-9289-06906670fd4e'
    const rangeKeyVal = '45'
    await TestModelRangeKey.get(user, hashKeyVal, rangeKeyVal).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(
      user,
      'get',
      hashKeyVal,
      rangeKeyVal
    )
  })

  it('passes correct params to `getBatch` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModelV2').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    const keys = [
      'cb5082cc-151a-4a9a-9289-06906670fd4e',
      'yx5082cc-151a-4a9a-9289-06906670fd4e',
    ]
    await TestModel.getBatch(user, keys).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck.mock.calls[0]).toEqual([
      user,
      'get',
      keys[0],
      undefined,
    ])
    expect(authorizationCheck.mock.calls[1]).toEqual([
      user,
      'get',
      keys[1],
      undefined,
    ])
  })

  it('passes correct params to `getBatch` authorization check with range key', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelV2RangeKey')
      .default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const keys = [
      {
        id: 'cb5082cc-151a-4a9a-9289-06906670fd4e',
      },
      {
        id: 'yx5082cc-151a-4a9a-9289-06906670fd4e',
        age: 45,
      },
    ]
    await TestModelRangeKey.getBatch(user, keys).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck.mock.calls[0]).toEqual([
      user,
      'get',
      keys[0].id,
      null,
    ])
    expect(authorizationCheck.mock.calls[1]).toEqual([
      user,
      'get',
      keys[1].id,
      keys[1].age,
    ])
  })

  it('passes correct params to `create` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModelV2').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'yx5082cc-151a-4a9a-9289-06906670fd4e'
    const item = {
      id: hashKeyVal,
    }
    await TestModel.create(user, item).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(
      user,
      'create',
      hashKeyVal,
      undefined,
      item
    )
  })

  it('passes correct params to `create` authorization check if there is a range key', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModel = require('../test-utils/ExampleModelV2').default
    const authorizationCheck = jest.fn(() => false)
    TestModel.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'yx5082cc-151a-4a9a-9289-06906670fd4e'
    const item = {
      id: hashKeyVal,
      range: 'thing',
    }
    await TestModel.create(user, item).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(
      user,
      'create',
      hashKeyVal,
      'thing',
      item
    )
  })

  it('passes correct params to `update` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleModelV2RangeKey')
      .default
    const authorizationCheck = jest.fn(() => false)
    TestModelRangeKey.isQueryAuthorized = authorizationCheck

    const hashKeyVal = 'xy5082cc-151a-4a9a-9289-06906670fd4e'
    const rangeKeyVal = '30'
    const item = {
      [TestModelRangeKey.hashKey]: hashKeyVal,
      [TestModelRangeKey.rangeKey]: rangeKeyVal,
    }
    await TestModelRangeKey.update(user, item).catch(() => {}) // Ignore any authorization errors
    expect(authorizationCheck).toBeCalledWith(
      user,
      'update',
      hashKeyVal,
      rangeKeyVal,
      item
    )
  })
})
