/* eslint-env jest */

import moment from 'moment'
import UserModel from '../../users/UserModel'
import UserMissionModel from '../UserMissionModel'
import MissionModel from '../MissionModel'
import squadInviteResponse from '../squadInviteResponse'
import { getMockUserContext, getMockUserInfo, mockDate } from '../../test-utils'
import databaseClient from '../../databaseClient'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../../utils/permissions-overrides'

jest.mock('../../databaseClient')
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

const getMockMission = (pendingUserId) => {
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
  it('creates updates Mission and User if not accepted', async () => {
    expect.assertions(3)

    const userInfo = getMockUserInfo()
    const defaultUserContext = getMockUserContext()
    const updateUserModel = jest.spyOn(UserModel, 'update')
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

    expect(updateMissionMethod).toHaveBeenCalledWith(override, {
      id: mockMission.id,
      rejectedSquadMembers: ['bcdefghijklmnop', userInfo.id],
      pendingSquadMembersExisting: ['efghijklmnopqrs', 'tuvwxyzabcde'],
      updated: moment.utc().toISOString(),
    })

    expect(updateUserModel).toHaveBeenCalledWith(defaultUserContext, {
      id: 'abcdefghijklmno',
      pendingMissionInvites: [],
      updated: '2017-05-19T13:59:46.000Z',
    })
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
      pendingMissionInvites: [],
    })

    expect(updateMissionMethod).toHaveBeenCalledWith(override, {
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
        created: moment.utc().toISOString(),
        updated: moment.utc().toISOString(),
        acknowledgedMissionStarted: true,
      }
    )
  })
  it('it starts the mission if this is the first user to accept an invite', async () => {
    expect.assertions(4)

    const defaultUserContext = getMockUserContext()
    const getOrCreateUserMissionMethod = jest.spyOn(
      UserMissionModel,
      'getOrCreate'
    )
    const updateUserMethod = jest.spyOn(UserModel, 'update')
    const updateMissionMethod = jest.spyOn(MissionModel, 'update')

    const mockMission = {
      id: '123456789',
      squadName: 'TestSquad',
      created: '2017-07-19T03:05:12Z',
      tabGoal: 1000,
      acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73'],
      pendingSquadMembersExisting: [
        'efghijklmnopqrs',
        defaultUserContext.id,
        'tuvwxyzabcde',
      ],
      pendingSquadMembersEmailInvite: ['alec+897234@tabforacause.org'],
      rejectedSquadMembers: ['bcdefghijklmnop'],
    }

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
      pendingMissionInvites: [],
    })

    expect(updateMissionMethod).toHaveBeenCalledWith(override, {
      id: mockMission.id,
      acceptedSquadMembers: [
        'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
        defaultUserContext.id,
      ],
      pendingSquadMembersExisting: ['efghijklmnopqrs', 'tuvwxyzabcde'],
      updated: moment.utc().toISOString(),
      started: '2017-05-19T13:59:46.000Z',
    })

    expect(getOrCreateUserMissionMethod).toHaveBeenCalledWith(
      defaultUserContext,
      {
        userId: defaultUserContext.id,
        missionId: mockMission.id,
        created: moment.utc().toISOString(),
        updated: moment.utc().toISOString(),
        acknowledgedMissionStarted: true,
      }
    )
  })
})
