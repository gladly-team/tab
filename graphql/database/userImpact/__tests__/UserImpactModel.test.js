/* eslint-env jest */

import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import UserImpact from '../UserImpactModel'
import { USER_VISIT_IMPACT_VALUE } from '../../constants'
import {
  DatabaseOperation,
  mockDate,
  getMockUserContext,
  setMockDBResponse,
} from '../../test-utils'
import {
  UnauthorizedQueryException,
  UserDoesNotExistException,
} from '../../../utils/exceptions'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserImpactModel', () => {
  it('implements the name property', () => {
    expect(UserImpact.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserImpact.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(UserImpact.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(UserImpact.tableName).toBe(tableNames.userImpact)
  })

  it('has the correct get permission', () => {
    expect(UserImpact.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct update permission', () => {
    expect(UserImpact.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(UserImpact.permissions.getAll()).toBe(false)
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(UserImpact.permissions.create(userContext, 'abc')).toBe(true)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(UserImpact.permissions.create(userContext, null, null, item)).toBe(
      false
    )
  })

  it('throws an UserDoesNotExistException error when a `get` returns no item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id

    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: null,
    })
    return expect(UserImpact.get(userContext, mockItemId)).rejects.toEqual(
      new UserDoesNotExistException()
    )
  })

  it('throws an error when `get` throws an error other than "item does not exist"', () => {
    const userContext = getMockUserContext()

    // Use an unauthorized request to get its error.
    return expect(
      UserImpact.get(userContext, 'unauthorized-user-id-here')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('does not throw an error when a `get` returns an item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id
    const mockCharityId = 'some-charity'
    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        // Actual item would have more properties
        userId: mockItemId,
        charityId: mockCharityId,
      },
    })

    return expect(
      UserImpact.get(userContext, mockItemId, mockCharityId)
    ).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new UserImpact({
        userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        charityId: 'some-charity',
      })
    )
    expect(item).toEqual({
      userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      charityId: 'some-charity',
      userImpactMetric: 0,
      pendingUserReferralImpact: 0,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      confirmedImpact: false,
    })
  })
})
