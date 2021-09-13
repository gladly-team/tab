/* eslint-env jest */
import buildMissionReturnType from '../utils'
import restartMission from '../restartMission'
import MissionModel from '../MissionModel'
import UserMission from '../UserMissionModel'
import UserModel from '../../users/UserModel'
import {
  DatabaseOperation,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../getCurrentUserMission')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})
const mockUserContext = {
  id: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
  email: 'foo@bar.com',
  emailVerified: true,
  authTime: 1533144713,
}
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
const mockUser = {
  tabs: 299,
  validTabs: 265,
  vcCurrent: 216,
  id: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
  email: 'alec+01@tabforacause.org',
  created: '2017-07-19T03:05:12Z',
  joined: '2017-07-19T03:05:12Z',
  pendingMissionInvites: [],
  username: 'alec',
}
describe('restartMission tests', () => {
  it('it successfully restarts a mission for users with a completed mission who accepted a previous mission', async () => {
    expect.assertions(3)
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateUserModel = jest.spyOn(UserModel, 'update')
    const currentMission = await restartMission(
      mockUserContext,
      'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
      '123456789'
    )
    expect(updateUserModel).toHaveBeenCalledTimes(2)
    const [[arg1, arg2], [arg3, arg4]] = updateUserModel.mock.calls
    expect(arg2).toEqual({
      id: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
      currentMissionId: expect.any(String),
      updated: expect.any(String),
    })
    expect(arg4).toEqual({
      id: undefined,
      pendingMissionInvites: [
        {
          invitingUser: {
            name: 'alec',
            userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
          },
          missionId: expect.any(String),
        },
      ],
      updated: expect.any(String),
    })
  })

  it('it throws if user is in a current mission', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockMissionDocument,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: { ...mockUser, currentMissionId: '123456789' },
    })
    await expect(
      restartMission(
        mockUserContext,
        'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
        '123456789'
      )
    ).rejects.toThrow()
  })
})
