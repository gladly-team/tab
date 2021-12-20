/* eslint-env jest */
import sgMail from '@sendgrid/mail'
import { verifyAndSendInvite } from '../utils'

import InvitedUsersModel from '../InvitedUsersModel'
import UserModel from '../../users/UserModel'
import UserMissionModel from '../../missions/UserMissionModel'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../cause/getCause')
jest.mock('@sendgrid/mail', () => ({ send: jest.fn(), setApiKey: jest.fn() }))
const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})
beforeEach(() => {
  jest.clearAllMocks()
  // clearAllMockDBResponses()
})
afterEach(() => {
  jest.clearAllMocks()
  // clearAllMockDBResponses()
})
const userId = userContext.id
const mockParams = {
  userContext,
  inviterId: userId,
  inviteEmail: 'test123',
  invitingUser: getMockUserInstance({ username: 'test1' }),
  inviterName: 'alec',
  templateId: 'mock-default-template',
  templateData: {
    title: 'mock title {{name}}',
    about: 'this is an about',
    faq: 'this is an faq',
  },
}
const mockSquadParams = {
  ...mockParams,
  currentMissionId: '123456789',
  templateId: 'mock-squad-template',
}
describe('verifyAndSendInvite general email', () => {
  it('it successfully creates a new invite user document,sends email, and returns expected value for Squads', async () => {
    expect.assertions(5)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const createInvitedUserMethod = jest.spyOn(InvitedUsersModel, 'create')
    const createUserMissionMethod = jest.spyOn(UserMissionModel, 'create')
    const updateUserMethod = jest.spyOn(UserModel, 'update')
    const results = await verifyAndSendInvite(mockSquadParams)
    expect(createInvitedUserMethod).toHaveBeenCalledWith(userContext, {
      created: '2017-06-22T01:13:28.000Z',
      invitedEmail: 'test123',
      inviterId: 'abcdefghijklmno',
      updated: '2017-06-22T01:13:28.000Z',
      missionId: '123456789',
    })
    expect(sgMail.send).toHaveBeenCalledWith({
      asm: { group_id: 3861, groups_to_display: [3861] },
      category: 'squadReferral',
      dynamicTemplateData: {
        about: 'this is an about',
        faq: 'this is an faq',
        missionId: '123456789',
        name: 'alec',
        personalMessage: undefined,
        title: 'mock title alec',
        username: 'test1',
      },
      from: 'foo@bar.com',
      templateId: 'mock-squad-template',
      to: 'test123',
    })
    expect(createUserMissionMethod).not.toHaveBeenCalled()
    expect(updateUserMethod).not.toHaveBeenCalled()
    expect(results).toEqual({ email: 'test123' })
  })

  it('it successfully invites an existing user to a squad', async () => {
    expect.assertions(3)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          ...getMockUserInstance({ username: 'test1' }),
          email: 'test123',
          pendingMissionInvites: [],
        },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    const createInvitedUserMethod = jest.spyOn(InvitedUsersModel, 'create')
    const updateUserMethod = jest.spyOn(UserModel, 'update')
    const results = await verifyAndSendInvite(mockSquadParams)
    expect(createInvitedUserMethod).not.toHaveBeenCalled()
    expect(updateUserMethod).toHaveBeenCalledWith(expect.anything(), {
      id: 'abcdefghijklmno',
      pendingMissionInvites: [
        {
          invitingUser: { name: 'alec', userId: 'abcdefghijklmno' },
          missionId: '123456789',
        },
      ],
      updated: '2017-06-22T01:13:28.000Z',
    })
    expect(results).toEqual({
      existingUserId: 'abcdefghijklmno',
      status: 'invited',
      existingUserName: 'test1',
      existingUserEmail: 'test123',
    })
  })

  it('it successfully rejects an existing user in a squad', async () => {
    expect.assertions(4)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          ...getMockUserInstance({ username: 'test1' }),
          email: 'test123',
          currentMissionId: 'someid',
          pendingMissionInvites: [],
        },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    const createInvitedUserMethod = jest.spyOn(InvitedUsersModel, 'create')
    const createUserMissionMethod = jest.spyOn(UserMissionModel, 'create')
    const updateUserMethod = jest.spyOn(UserModel, 'update')
    const results = await verifyAndSendInvite(mockSquadParams)
    expect(createInvitedUserMethod).not.toHaveBeenCalled()
    expect(createUserMissionMethod).not.toHaveBeenCalled()
    expect(updateUserMethod).not.toHaveBeenCalled()
    expect(results).toEqual({
      existingUserId: 'abcdefghijklmno',
      status: 'rejected',
      existingUserName: 'test1',
      existingUserEmail: 'test123',
    })
  })

  it('it successfully creates a new invite user document', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const createMethod = jest.spyOn(InvitedUsersModel, 'create')
    await verifyAndSendInvite(mockParams)
    expect(createMethod).toHaveBeenCalledWith(userContext, {
      created: '2017-06-22T01:13:28.000Z',
      invitedEmail: 'test123',
      inviterId: 'abcdefghijklmno',
      updated: '2017-06-22T01:13:28.000Z',
    })
  })

  it('sends an email if a user doesnt already exist and hasnt been invited in the last 30 days', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Item: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Item: [],
    })
    await verifyAndSendInvite(mockParams)
    expect(sgMail.send).toHaveBeenCalledWith({
      asm: { group_id: 3861, groups_to_display: [3861] },
      category: 'referral',
      dynamicTemplateData: {
        about: 'this is an about',
        faq: 'this is an faq',
        missionId: undefined,
        name: 'alec',
        personalMessage: undefined,
        title: 'mock title alec',
        username: 'test1',
      },
      from: 'foo@bar.com',
      templateId: 'mock-default-template',
      to: 'test123',
    })
  })

  it('does not send an email if invited user already exists', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        { ...getMockUserInstance({ username: 'test1' }), email: 'test123' },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    await verifyAndSendInvite(mockParams)
    expect(sgMail.send).not.toHaveBeenCalled()
  })

  it('if user already exists it gives the appropriate error reason', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        { ...getMockUserInstance({ username: 'test1' }), email: 'test123' },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const results = await verifyAndSendInvite(mockParams)
    expect(results.error).toBe('user already exists')
  })

  it('does not send an email if user has been invited in the last 30 days', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    await verifyAndSendInvite(mockParams)
    expect(sgMail.send).not.toHaveBeenCalled()
  })

  it('if user has already been invite, it gives the appropriate error reason', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    const results = await verifyAndSendInvite(mockParams)
    expect(results.error).toBe('user has been invited recently')
  })

  it('if the email fails to send, it gives the appropriate error reason', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    sgMail.send.mockImplementation(new Error('error'))
    const results = await verifyAndSendInvite(mockParams)
    expect(results.error).toBe('email failed to send')
  })
})
beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})
afterEach(() => {
  jest.clearAllMocks()
})
