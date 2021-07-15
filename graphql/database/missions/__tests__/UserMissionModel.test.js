/* eslint-env jest */

import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import UserMission from '../UserMissionModel'
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

describe('UserMissionModel', () => {
  it('implements the name property', () => {
    expect(UserMission.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserMission.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(UserMission.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(UserMission.tableName).toBe(tableNames.userMissions)
  })

  it('has the correct get permission', () => {
    expect(UserMission.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct update permission', () => {
    expect(UserMission.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(UserMission.permissions.getAll()).toBe(false)
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(UserMission.permissions.create(userContext, 'abc')).toBe(true)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(UserMission.permissions.create(userContext, null, null, item)).toBe(
      false
    )
  })

  it('throws an error when `get` throws an error other than "item does not exist"', () => {
    const userContext = getMockUserContext()

    // Use an unauthorized request to get its error.
    return expect(
      UserMission.get(userContext, 'unauthorized-user-id-here')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('does not throw an error when a `get` returns an item', () => {
    const userContext = getMockUserContext()
    const mockItemId = userContext.id
    const mockInvitedEmail = 'some-email'
    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
        missionId: '123456789',
        squadName: 'TestSquad',
        tabs: 234,
        longestTabStreak: 4,
        currentTabStreak: 2,
        missionMaxTabsDay: 10,
        acknowledgedMissionStarted: true,
        acknowledgedMissionComplete: false,
      },
    })

    return expect(
      UserMission.get(userContext, mockItemId, mockInvitedEmail)
    ).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new UserMission({
        userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        missionId: '123456789',
      })
    )
    expect(item).toEqual({
      userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      missionId: '123456789',
      tabs: 0,
      longestTabStreak: 0,
      currentTabStreak: 0,
      missionMaxTabsDay: 0,
      acknowledgedMissionComplete: false,
      acknowledgedMissionStarted: false,
    })
  })
})
