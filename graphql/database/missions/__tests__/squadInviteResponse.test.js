/* eslint-env jest */

import moment from 'moment'
import UserModel from '../../users/UserModel'
import UserMissionModel from '../UserMissionModel'
import MissionModel from '../MissionModel'
import squadInviteResponse from '../squadInviteResponse'
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  setModelPermissions,
} from '../../test-utils'
import databaseClient from '../../databaseClient'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
  setModelPermissions(MissionModel, {
    get: () => true,
    getAll: () => true,
    update: () => true,
    create: () => true,
  })
})

const getMockMission = pendingUserId => {
  return {
    id: '123456789',
    squadName: 'TestSquad',
    created: '2017-07-19T03:05:12Z',
    started: '2017-07-19T03:05:12Z',
    tabGoal: 1000,
    acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
    pendingSquadMembersExisting: [
      'efghijklmnopqrs',
      pendingUserId,
      'tuvwxyzabcde',
    ],
    pendingSquadMembersEmailInvite: ['alec+897234@tabforacause.org'],
    rejectedSquadMembers: ['bcdefghijklmnop'],
  }
}

describe('squadInviteResponse', () => {
  it('creates UserToMission and updates Mission if not accepted', async () => {
    expect.assertions(3)

    const userInfo = getMockUserInfo()
    const defaultUserContext = getMockUserContext()
    const getOrCreateUserMissionMethod = jest.spyOn(
      UserMissionModel,
      'getOrCreate'
    )
    const updateMissionMethod = jest.spyOn(MissionModel, 'update')

    const mockMission = getMockMission(defaultUserContext.id)

    const dbQueryMock = databaseClient.get.mockImplementation(
      (params, callback) => {
        callback(null, {
          Item: mockMission,
        })
      }
    )
    const expectedDBParams = {
      TableName: MissionModel.tableName,
      Key: {
        id: mockMission.id,
      },
    }

    await squadInviteResponse(
      defaultUserContext,
      userInfo.id,
      mockMission.id,
      false
    )

    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)

    expect(updateMissionMethod).toHaveBeenCalledWith(defaultUserContext, {
      id: mockMission.id,
      rejectedSquadMembers: ['bcdefghijklmnop', userInfo.id],
      pendingSquadMembersExisting: ['efghijklmnopqrs', 'tuvwxyzabcde'],
      updated: moment.utc().toISOString(),
    })

    expect(getOrCreateUserMissionMethod).toHaveBeenCalledWith(
      defaultUserContext,
      {
        userId: userInfo.id,
        missionId: mockMission.id,
        acknowledgedMissionStarted: false,
        created: moment.utc().toISOString(),
        updated: moment.utc().toISOString(),
      }
    )
  })

  it('creates UserToMission and updates User and Mission if accepted', async () => {
    expect.assertions(4)

    const defaultUserContext = getMockUserContext()
    const getOrCreateUserMissionMethod = jest.spyOn(
      UserMissionModel,
      'getOrCreate'
    )
    const updateUserMethod = jest.spyOn(UserModel, 'update')
    const updateMissionMethod = jest.spyOn(MissionModel, 'update')

    const mockMission = getMockMission(defaultUserContext.id)

    const dbQueryMock = databaseClient.get.mockImplementation(
      (params, callback) => {
        callback(null, {
          Item: mockMission,
        })
      }
    )
    const expectedDBParams = {
      TableName: MissionModel.tableName,
      Key: {
        id: mockMission.id,
      },
    }

    await squadInviteResponse(
      defaultUserContext,
      defaultUserContext.id,
      mockMission.id,
      true
    )

    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)

    expect(updateUserMethod).toHaveBeenCalledWith(defaultUserContext, {
      id: defaultUserContext.id,
      currentMissionId: mockMission.id,
      updated: moment.utc().toISOString(),
    })

    expect(updateMissionMethod).toHaveBeenCalledWith(defaultUserContext, {
      id: mockMission.id,
      acceptedSquadMembers: [
        'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
        'abcdefghijklmno',
        defaultUserContext.id,
      ],
      pendingSquadMembersExisting: ['efghijklmnopqrs', 'tuvwxyzabcde'],
      updated: moment.utc().toISOString(),
    })

    expect(getOrCreateUserMissionMethod).toHaveBeenCalledWith(
      defaultUserContext,
      {
        userId: defaultUserContext.id,
        missionId: mockMission.id,
        acknowledgedMissionStarted: true,
        created: moment.utc().toISOString(),
        updated: moment.utc().toISOString(),
      }
    )
  })
})
