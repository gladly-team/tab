/* eslint-env jest */
import moment from 'moment'
import getCurrentUserMission from '../getCurrentUserMission'
import completeMission from '../completeMission'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../../utils/permissions-overrides'
import { mockDate } from '../../test-utils'
import MissionModel from '../MissionModel'

jest.mock('../utils')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../getCurrentUserMission')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

const override = getPermissionsOverride(MISSIONS_OVERRIDE)

const mockDefaultMissionReturnIncomplete = {
  missionId: '123456789',
  status: 'started',
  squadName: 'TestSquad',
  tabGoal: 1000,
  endOfMissionAwards: [],
  created: '2017-07-19T03:05:12Z',
  tabCount: 258,
  squadMembers: [
    {
      username: 'alec',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 10,
      tabs: 258,
    },
  ],
}

const mockDefaultMissionReturnComplete = {
  missionId: '123456789',
  status: 'started',
  squadName: 'TestSquad',
  tabGoal: 350,
  endOfMissionAwards: [],
  created: '2017-07-19T03:05:12Z',
  tabCount: 354,
  squadMembers: [
    {
      username: 'alec',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 10,
      tabs: 258,
    },
    {
      username: 'kevin',
      status: 'accepted',
      longestTabStreak: 6,
      currentTabStreak: 2,
      missionMaxTabsDay: 15,
      tabs: 34,
    },
    {
      username: 'jed',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 20,
      tabs: 62,
    },
  ],
}

describe('completeMissions', () => {
  it('returns false if getCurrentUserMission returns null', async () => {
    expect.assertions(1)
    getCurrentUserMission.mockReturnValue(null)

    const completeMissionResult = await completeMission('123456789', '123')
    expect(completeMissionResult).toEqual(false)
  })

  it('returns false if mission is not completed yet', async () => {
    expect.assertions(1)
    getCurrentUserMission.mockReturnValue(mockDefaultMissionReturnIncomplete)

    const completeMissionResult = await completeMission('123456789', '123')
    expect(completeMissionResult).toEqual(false)
  })

  it('calculates end of mission awards correctly and complete time', async () => {
    expect.assertions(2)
    getCurrentUserMission.mockReturnValue(mockDefaultMissionReturnComplete)

    const updateMethod = jest.spyOn(MissionModel, 'update')

    const completeMissionResult = await completeMission('123456789', '123')

    expect(updateMethod).toHaveBeenCalledWith(override, {
      id: mockDefaultMissionReturnComplete.missionId,
      completed: moment.utc().toISOString(),
      endOfMissionAwards: [
        {
          user: 'kevin',
          awardType: 'Consistent Kitty',
          unit: 6,
        },
        {
          user: 'jed',
          awardType: 'Hot Paws',
          unit: 20,
        },
        {
          user: 'alec',
          awardType: 'All-Star Fur Ball',
          unit: 258,
        },
      ],
      updated: moment.utc().toISOString(),
    })
    expect(completeMissionResult).toEqual(true)
  })
})
