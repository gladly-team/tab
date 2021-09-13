/* eslint-env jest */

import moment from 'moment'
import { cloneDeep } from 'lodash/lang'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import rewardReferringUser from '../rewardReferringUser'
import InvitedUsersModel from '../../invitedUsers/InvitedUsersModel'
import MissionModel from '../../missions/MissionModel'
import UserMissionModel from '../../missions/UserMissionModel'

jest.mock('../../databaseClient')
jest.mock('../rewardReferringUser')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('logEmailVerified', () => {
  it('sets emailVerified=true when it is true', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: true,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateQuery).toHaveBeenCalledWith(modifiedUserContext, {
      id: modifiedUserContext.id,
      emailVerified: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('sets emailVerified=false when it is false', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: false,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = false

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateQuery).toHaveBeenCalledWith(modifiedUserContext, {
      id: modifiedUserContext.id,
      emailVerified: false,
      updated: moment.utc().toISOString(),
    })
  })

  it('sets emailVerified=true with the default mock user context', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: true,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(userContext, userContext.id)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      emailVerified: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('returns the user object', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: true,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    const logEmailVerified = require('../logEmailVerified').default
    const returnedUser = await logEmailVerified(userContext, userContext.id)
    expect(returnedUser).toEqual(expectedReturnedUser)
  })

  it('calls to reward the referring user when the email is verified', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: true,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ inviterId: 'someInviterId', invitedEmail: 'foo@bar.com' }],
    })
    const updateSpy = jest.spyOn(InvitedUsersModel, 'update')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(rewardReferringUser).toHaveBeenCalledWith(
      modifiedUserContext,
      modifiedUserContext.id
    )
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), {
      invitedEmail: 'foo@bar.com',
      invitedId: 'abcdefghijklmno',
      inviterId: 'someInviterId',
      updated: '2017-05-19T13:59:46.000Z',
    })
  })

  it('does not reward the referring user when the email is verified but referral is a squad invite', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      emailVerified: true,
      currentMissionId: '123456789',
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ inviterId: 'someInviterId', invitedEmail: 'foo@bar.com' }],
    })
    const updateSpy = jest.spyOn(InvitedUsersModel, 'update')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(rewardReferringUser).not.toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), {
      invitedEmail: 'foo@bar.com',
      invitedId: 'abcdefghijklmno',
      inviterId: 'someInviterId',
      updated: '2017-05-19T13:59:46.000Z',
    })
  })

  it('does not call to reward the referring user when the email is not verified', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = false
    const updateSpy = jest.spyOn(InvitedUsersModel, 'update')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(rewardReferringUser).not.toHaveBeenCalled()
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('updates the mission and creates a new UserMission if the new user was invited to a squad', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: { currentMissionId: '123456789' },
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ inviterId: 'someInviterId', invitedEmail: 'foo@bar.com' }],
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        id: '123456789',
        squadName: 'TestSquad',
        created: '2017-07-19T03:05:12Z',
        started: '2017-07-19T03:05:12Z',
        tabGoal: 1000,
        acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73'],
        pendingSquadMembersExisting: ['efghijklmnopqrs'],
        pendingSquadMembersEmailInvite: ['foo@bar.com'],
        rejectedSquadMembers: [],
      },
    })
    const updateSpy = jest.spyOn(MissionModel, 'update')
    const createSpy = jest.spyOn(UserMissionModel, 'create')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), {
      acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
      id: '123456789',
      pendingSquadMembersEmailInvite: [],
      updated: '2017-05-19T13:59:46.000Z',
    })
    expect(createSpy).toHaveBeenCalledWith(
      expect.anything(),
      {
        created: '2017-05-19T13:59:46.000Z',
        missionId: '123456789',
        updated: '2017-05-19T13:59:46.000Z',
        userId: 'abcdefghijklmno',
      },
      expect.anything()
    )
  })

  it('updates the mission and starts the mission if this is the first user to join', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = true
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: { currentMissionId: '123456789' },
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ inviterId: 'someInviterId', invitedEmail: 'foo@bar.com' }],
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        id: '123456789',
        squadName: 'TestSquad',
        created: '2017-07-19T03:05:12Z',
        tabGoal: 1000,
        acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73'],
        pendingSquadMembersExisting: ['efghijklmnopqrs'],
        pendingSquadMembersEmailInvite: ['foo@bar.com'],
        rejectedSquadMembers: [],
      },
    })
    const updateSpy = jest.spyOn(MissionModel, 'update')
    const createSpy = jest.spyOn(UserMissionModel, 'create')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateSpy).toHaveBeenCalledWith(expect.anything(), {
      acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
      id: '123456789',
      pendingSquadMembersEmailInvite: [],
      started: '2017-05-19T13:59:46.000Z',
      updated: '2017-05-19T13:59:46.000Z',
    })
    expect(createSpy).toHaveBeenCalledWith(
      expect.anything(),
      {
        created: '2017-05-19T13:59:46.000Z',
        missionId: '123456789',
        updated: '2017-05-19T13:59:46.000Z',
        userId: 'abcdefghijklmno',
      },
      expect.anything()
    )
  })

  it('does not call update the mission or create a userMission if user was not invited to a squad', async () => {
    expect.assertions(2)

    const modifiedUserContext = cloneDeep(userContext)
    modifiedUserContext.emailVerified = false
    const updateSpy = jest.spyOn(MissionModel, 'update')
    const createSpy = jest.spyOn(UserMissionModel, 'create')
    const logEmailVerified = require('../logEmailVerified').default
    await logEmailVerified(modifiedUserContext, modifiedUserContext.id)
    expect(updateSpy).not.toHaveBeenCalled()
    expect(createSpy).not.toHaveBeenCalled()
  })
})
