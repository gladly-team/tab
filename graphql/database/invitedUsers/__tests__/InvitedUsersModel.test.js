/* eslint-env jest */

import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import InvitedUsers from '../InvitedUsersModel'
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

describe('InvitedUsersModel', () => {
  it('implements the name property', () => {
    expect(InvitedUsers.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(InvitedUsers.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(InvitedUsers.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(InvitedUsers.tableName).toBe(tableNames.invitedUsers)
  })

  it('has the correct get permission', () => {
    expect(InvitedUsers.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct update permission', () => {
    expect(InvitedUsers.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(InvitedUsers.permissions.getAll()).toBe(false)
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(InvitedUsers.permissions.create(userContext, 'abc')).toBe(true)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(InvitedUsers.permissions.create(userContext, null, null, item)).toBe(
      false
    )
  })

  it('throws an error when `get` throws an error other than "item does not exist"', () => {
    const userContext = getMockUserContext()

    // Use an unauthorized request to get its error.
    return expect(
      InvitedUsers.get(userContext, 'unauthorized-user-id-here')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('does not throw an error when a `get` returns an item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id
    const mockInvitedEmail = 'some-email'
    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        inviterId: mockItemId,
        invitedEmail: mockInvitedEmail,
      },
    })

    return expect(
      InvitedUsers.get(userContext, mockItemId, mockInvitedEmail)
    ).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new InvitedUsers({
        inviterId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        invitedEmail: 'test@gmail.com',
      })
    )
    expect(item).toEqual({
      inviterId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      invitedEmail: 'test@gmail.com',
    })
  })
})
