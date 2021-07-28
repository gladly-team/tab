/* eslint-env jest */
import createMission from '../createMission'
import UserModel from '../../users/UserModel'
import { getMockUserContext } from '../../test-utils'
import MissionModel from '../MissionModel'
import UserMissionModel from '../UserMissionModel'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../MissionModel', () => ({
  create: jest.fn(),
}))
jest.mock('../UserMissionModel', () => ({
  create: jest.fn(),
}))
jest.mock('../../users/UserModel', () => ({
  get: jest.fn(),
  update: jest.fn(),
}))
beforeEach(() => {
  jest.clearAllMocks()
})

describe('createMission tests', () => {
  it('it creates a mission, user mission, and returns the squad id', async () => {
    expect.assertions(4)
    const user = {
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'kevin',
      joined: '2017-07-18T20:45:53Z',
    }
    UserModel.get.mockReturnValueOnce(user)
    const returnObject = await createMission(
      getMockUserContext(),
      'abcdefghijklmno',
      'someSquadName'
    )
    expect(MissionModel.create).toHaveBeenCalled()
    expect(UserMissionModel.create).toHaveBeenCalled()
    expect(typeof returnObject.squadId).toEqual('string')
    expect(returnObject.squadId.length).toEqual(9)
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
