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

const missionsOverride = getPermissionsOverride(MISSIONS_OVERRIDE)

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
      userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
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
      userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
      username: 'alec',
      status: 'accepted',
      tabStreak: {
        longestTabStreak: 4,
        currentTabStreak: 2,
      },
      missionMaxTabsDay: {
        maxDay: { date: '2017-07-19T03:05:12Z', numTabs: 10 },
        recentDay: { date: '2017-07-19T03:05:12Z', numTabs: 10 },
      },
      tabs: 258,
    },
    {
      userId: 'abcdefghijklmno',
      username: 'kevin',
      status: 'accepted',
      tabStreak: {
        longestTabStreak: 6,
        currentTabStreak: 2,
      },
      missionMaxTabsDay: {
        maxDay: { date: '2017-07-19T03:05:12Z', numTabs: 15 },
        recentDay: { date: '2017-07-19T03:05:12Z', numTabs: 10 },
      },
      tabs: 34,
    },
    {
      userId: 'omnlkjihgfedcba',
      username: 'jed',
      status: 'accepted',
      tabStreak: {
        longestTabStreak: 4,
        currentTabStreak: 2,
      },
      missionMaxTabsDay: {
        maxDay: { date: '2017-07-19T03:05:12Z', numTabs: 20 },
        recentDay: { date: '2017-07-19T03:05:12Z', numTabs: 10 },
      },
      tabs: 62,
    },
  ],
}

describe('completeMissions', () => {
  it('returns false if getCurrentUserMission returns null', async () => {
    expect.assertions(1)
    getCurrentUserMission.mockReturnValue(null)

    const completeMissionResult = await completeMission('123', '123456789')
    expect(completeMissionResult).toEqual(false)
  })

  it('returns false if mission is not completed yet', async () => {
    expect.assertions(1)
    getCurrentUserMission.mockReturnValue(mockDefaultMissionReturnIncomplete)

    const completeMissionResult = await completeMission('123', '123456789')
    expect(completeMissionResult).toEqual(false)
  })

  it('calculates end of mission awards correctly and complete time', async () => {
    expect.assertions(2)
    getCurrentUserMission.mockReturnValue(mockDefaultMissionReturnComplete)

    const updateMissionMethod = jest.spyOn(MissionModel, 'update')

    const completeMissionResult = await completeMission('123', '123456789')

    expect(updateMissionMethod).toHaveBeenCalledWith(missionsOverride, {
      id: mockDefaultMissionReturnComplete.missionId,
      completed: moment.utc().toISOString(),
      endOfMissionAwards: [
        {
          user: 'abcdefghijklmno',
          awardType: 'Consistent Kitty',
          unit: 6,
        },
        {
          user: 'omnlkjihgfedcba',
          awardType: 'Hot Paws',
          unit: 20,
        },
        {
          user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
          awardType: 'All-Star Fur Ball',
          unit: 258,
        },
      ],
      updated: moment.utc().toISOString(),
    })
    expect(completeMissionResult).toEqual(true)
  })
})
