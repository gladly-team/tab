/* eslint-env jest */

import tableNames from '../../tables'
import Mission from '../MissionModel'
import {
  DatabaseOperation,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import {
  getPermissionsOverride,
  REWARD_REFERRER_OVERRIDE,
} from '../../../utils/permissions-overrides'

const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('MissionModel', () => {
  it('implements the name property', () => {
    expect(Mission.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Mission.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Mission.tableName).toBe(tableNames.missions)
  })

  it('does not throw an error when a `get` returns an item', () => {
    const mockItemId = '123456789'
    // Set mock response from DB client.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        id: '123456789',
        squadName: 'TestSquad',
        created: '2017-07-19T03:05:12Z',
        started: '2017-07-19T03:05:12Z',
        tabGoal: 1000,
        acceptedSquadMembers: [
          'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
          'abcdefghijklmno',
        ],
        pendingSquadMembersExisting: ['efghijklmnopqrs'],
        pendingSquadMembersEmailInvite: 'alec+897234@tabforacause.org',
        rejectedSquadMembers: [],
      },
    })

    return expect(Mission.get(override, mockItemId)).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new Mission({
        id: '123456789',
        squadName: 'TestSquad',
      })
    )
    expect(item).toEqual({
      id: '123456789',
      squadName: 'TestSquad',
      missionType: 'cats',
      acceptedSquadMembers: [],
      pendingSquadMembersExisting: [],
      pendingSquadMembersEmailInvite: [],
      rejectedSquadMembers: [],
      endOfMissionAwards: [],
    })
  })
})
