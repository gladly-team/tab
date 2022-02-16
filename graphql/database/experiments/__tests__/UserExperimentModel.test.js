/* eslint-env jest */
import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import UserExperiment from '../UserExperimentModel'
import {
  DatabaseOperation,
  mockDate,
  getMockUserContext,
  setMockDBResponse,
} from '../../test-utils'
import { UnauthorizedQueryException } from '../../../utils/exceptions'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserExperimentModel', () => {
  it('implements the name property', () => {
    expect(UserExperiment.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserExperiment.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(UserExperiment.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(UserExperiment.tableName).toBe(tableNames.userExperiment)
  })

  it('has the correct get permission', () => {
    expect(UserExperiment.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(UserExperiment.permissions.create(userContext, 'abc', '123')).toBe(
      true
    )
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(
      UserExperiment.permissions.create(userContext, null, null, item)
    ).toBe(false)
  })

  it('throws an error when `get` throws an error other than "item does not exist"', () => {
    const userContext = getMockUserContext()

    // Use an unauthorized request to get its error.
    return expect(
      UserExperiment.get(userContext, 'unauthorized-user-id-here')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('does not throw an error when a `get` returns an item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id
    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        experimentId: 'some-id',
        variationId: 'variation-id',
        timestampAssigned: '2017-05-19T13:59:46.000Z',
      },
    })

    return expect(
      UserExperiment.get(userContext, mockItemId, userContext.id)
    ).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new UserExperiment({
        userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        experimentId: 'some-id',
        variationId: 'variation-id',
      })
    )
    expect(item).toEqual({
      userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      experimentId: 'some-id',
      variationId: 'variation-id',
      timestampAssigned: '2017-05-19T13:59:46.000Z',
    })
  })
})
