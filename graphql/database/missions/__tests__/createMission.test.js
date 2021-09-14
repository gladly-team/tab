/* eslint-env jest */
import createMission from '../createMission'
import UserModel from '../../users/UserModel'
import { getMockUserContext } from '../../test-utils'
import MissionModel from '../MissionModel'
import UserMissionModel from '../UserMissionModel'
import config from '../../../config'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../MissionModel', () => ({
  create: jest.fn(),
  get: jest.fn(),
}))
jest.mock('../../../config')
jest.mock('../UserMissionModel', () => ({
  create: jest.fn(),
  query: () => ({ execute: jest.fn().mockReturnValue([]) }),
}))
jest.mock('../../users/UserModel', () => ({
  get: jest.fn(),
  update: jest.fn(),
  getBatch: jest.fn().mockReturnValue([]),
}))
beforeEach(() => {
  jest.clearAllMocks()
})
const mockDefaultMissionReturn = {
  id: '123456789',
  status: 'pending',
  squadName: 'TestSquad',
  tabGoal: 1000,
  endOfMissionAwards: [],
  created: '2017-07-19T03:05:12Z',
  tabCount: 0,
  acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73'],
  pendingSquadMembersExisting: [],
  pendingSquadMembersEmailInvite: [],
  rejectedSquadMembers: [],
  missionType: 'cats',
}
describe('createMission tests', () => {
  it('it creates a mission, user mission, and returns the squad id', async () => {
    expect.assertions(3)
    const user = {
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'kevin',
      joined: '2017-07-18T20:45:53Z',
    }
    UserModel.get.mockReturnValueOnce(user)
    MissionModel.get.mockReturnValue(mockDefaultMissionReturn)
    const returnObject = await createMission(
      getMockUserContext(),
      'abcdefghijklmno',
      'someSquadName'
    )
    expect(MissionModel.create).toHaveBeenCalled()
    expect(UserMissionModel.create).toHaveBeenCalled()
    expect(returnObject.currentMission.missionId).toEqual('123456789')
  })

  it('it creates a mission in qa env with lower tab goal, user mission, and returns the squad id', async () => {
    expect.assertions(3)
    const user = {
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'kevin',
      joined: '2017-07-18T20:45:53Z',
    }
    config.E2E_MISSIONS_TEST_TAB_GOAL = 'true'
    MissionModel.create.mockReset()
    UserModel.get.mockReturnValueOnce(user)
    MissionModel.get.mockReturnValue(mockDefaultMissionReturn)
    const returnObject = await createMission(
      getMockUserContext(),
      'abcdefghijklmno',
      'someSquadName'
    )
    expect(MissionModel.create).toHaveBeenCalledWith(expect.anything(), {
      acceptedSquadMembers: ['abcdefghijklmno'],
      id: expect.anything(),
      squadName: 'someSquadName',
      tabGoal: 3,
    })
    expect(UserMissionModel.create).toHaveBeenCalled()
    expect(returnObject.currentMission.missionId).toEqual('123456789')
  })

  it('it throws an error if user is already in an ongoing mission', async () => {
    expect.assertions(1)
    const user = {
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'kevin',
      joined: '2017-07-18T20:45:53Z',
      currentMissionId: '123456789',
    }
    UserModel.get.mockReturnValueOnce(user)
    await expect(
      createMission(getMockUserContext(), 'abcdefghijklmno', 'someSquadName')
    ).rejects.toThrow(
      'attempting to create a new squad while still in an ongoing missions'
    )
  })
})
