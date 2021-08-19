/* eslint-env jest */
import buildMissionReturnType from '../utils'
import getCurrentUserMission from '../getCurrentUserMission'
import {
  DatabaseOperation,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../utils')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})
const mockUserMissions = [
  {
    userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
    missionId: '123456789',
    created: '2017-07-19T03:05:12Z',
    tabs: 234,
    tabStreak: {
      longestTabStreak: 4,
      currentTabStreak: 2,
    },
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: false,
  },
  {
    userId: 'abcdefghijklmno',
    missionId: '123456789',
    created: '2017-07-19T03:05:12Z',
    tabs: 24,
    tabStreak: {
      longestTabStreak: 4,
      currentTabStreak: 2,
    },
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: false,
  },
]
const mockMissionDocument = {
  id: '123456789',
  squadName: 'TestSquad',
  created: '2017-07-19T03:05:12Z',
  started: '2017-07-19T03:05:12Z',
  tabGoal: 1000,
  acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
  pendingSquadMembersExisting: ['efghijklmnopqrs'],
  pendingSquadMembersEmailInvite: ['alec+897234@tabforacause.org'],
  rejectedSquadMembers: [],
  endOfMissionAwards: [],
  missionType: 'cats',
}
const mockDefaultMissionReturn = {
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
      tabs: 234,
    },
    {
      username: 'kevin',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 10,
      tabs: 24,
    },
  ],
}
// const mockParams = [userContext, userId, ['test123', 'test124'], 'alec']
describe('getCurrentUserMission tests', () => {
  it('it successfully gets current mission for users with a mission', async () => {
    expect.assertions(3)
    buildMissionReturnType.mockReturnValue(mockDefaultMissionReturn)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: mockUserMissions,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })

    const currentMission = await getCurrentUserMission({
      currentMissionId: '123456789',
      id: '123',
    })
    expect(buildMissionReturnType).toHaveBeenCalled()
    expect(buildMissionReturnType).toHaveBeenCalledWith(
      mockMissionDocument,
      mockUserMissions,
      '123'
    )
    expect(currentMission).toEqual(mockDefaultMissionReturn)
  })

  it('it returns null if user is not in a current mission', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: mockUserMissions,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })
    buildMissionReturnType.mockReturnValue(mockDefaultMissionReturn)
    const currentMission = await getCurrentUserMission({
      id: '123',
    })
    expect(currentMission).toEqual(null)
  })
})
