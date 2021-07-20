/* eslint-env jest */
import buildMissionReturnType from '../utils'
import getPastUserMissions from '../getPastUserMissions'
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
    longestTabStreak: 4,
    currentTabStreak: 2,
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: true,
  },
  {
    userId: 'abcdefghijklmno',
    missionId: '123456789',
    created: '2017-07-19T03:05:12Z',
    tabs: 24,
    longestTabStreak: 4,
    currentTabStreak: 2,
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: true,
  },
]
const mockMissionDocument = {
  id: '123456789',
  squadName: 'TestSquad',
  created: '2017-07-19T03:05:12Z',
  started: '2017-07-19T03:05:12Z',
  completed: '2017-07-19T03:05:12Z',
  tabGoal: 1000,
  acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
  pendingSquadMembersExisting: ['efghijklmnopqrs'],
  pendingSquadMembersEmailInvite: ['alec+897234@tabforacause.org'],
  rejectedSquadMembers: [],
  endOfMissionAwards: [],
  missionType: 'cats',
}
// const mockParams = [userContext, userId, ['test123', 'test124'], 'alec']
describe('getPastUserMissions tests', () => {
  it('it successfully gets current mission for users with a mission', async () => {
    expect.assertions(2)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [mockUserMissions[0]],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: mockUserMissions,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })
    await getPastUserMissions({
      currentMissionId: '123456789',
      id: '123',
    })
    expect(buildMissionReturnType).toHaveBeenCalled()
    expect(buildMissionReturnType).toHaveBeenCalledWith(
      mockMissionDocument,
      mockUserMissions,
      '123'
    )
  })

  it('it successfully returns an empty array if user has no past missions', async () => {
    expect.assertions(2)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: mockUserMissions,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })
    const results = await getPastUserMissions({
      currentMissionId: '123456789',
      id: '123',
    })
    expect(buildMissionReturnType).not.toHaveBeenCalled()
    expect(results).toEqual([])
  })
})
