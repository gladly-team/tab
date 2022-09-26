/* eslint-env jest */
import { getMockUserContext } from '../../test-utils'

const user = getMockUserContext()

describe('Model calls to `isQueryAuthorized`', () => {
  afterEach(() => {
    jest.resetModules()
  })

  it('passes correct params to `get` authorization check', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleDynamoDBModelRangeKey')
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

  it('passes correct params to `getBatch` authorization check with range key', async () => {
    // Set a mock `isQueryAuthorized` method
    const TestModelRangeKey = require('../test-utils/ExampleDynamoDBModelRangeKey')
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
})
