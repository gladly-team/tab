/* eslint-env jest */
import sgMail from '@sendgrid/mail'
import { verifyAndSendInvite } from '../utils'

import InvitedUsersModel from '../InvitedUsersModel'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('@sendgrid/mail', () => ({ send: jest.fn(), setApiKey: jest.fn() }))
const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})
afterEach(() => {
  jest.clearAllMocks()
})
const userId = userContext.id
const mockParams = [
  userContext,
  userId,
  'test123',
  getMockUserInstance({ username: 'test1' }),
  'alec',
]
describe('verifyAndSendInvite', () => {
  it('it successfully creates a new invite user document', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const createMethod = jest.spyOn(InvitedUsersModel, 'create')
    await verifyAndSendInvite(...mockParams)
    expect(createMethod).toHaveBeenCalledWith(userContext, {
      created: '2017-06-22T01:13:28.000Z',
      invitedEmail: 'test123',
      inviterId: 'abcdefghijklmno',
      updated: '2017-06-22T01:13:28.000Z',
    })
  })

  it('sends an email if a user doesnt already exist and hasnt been invited in the last 30 days', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Item: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Item: [],
    })
    await verifyAndSendInvite(...mockParams)
    expect(sgMail.send).toHaveBeenCalledWith({
      dynamicTemplateData: { name: 'alec', username: 'test1' },
      from: 'foo@bar.com',
      templateId: 'd-69707bd6c49a444fa68a99505930f801',
      to: 'test123',
      asm: { group_id: 3861, groups_to_display: [3861] },
    })
  })

  it('does not send an email if invited user already exists', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        { ...getMockUserInstance({ username: 'test1' }), email: 'test123' },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    await verifyAndSendInvite(...mockParams)
    expect(sgMail.send).not.toHaveBeenCalled()
  })

  it('if user already exists it gives the appropriate error reason', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        { ...getMockUserInstance({ username: 'test1' }), email: 'test123' },
      ],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const results = await verifyAndSendInvite(...mockParams)
    expect(results.error).toBe('user already exists')
  })

  it('does not send an email if user has been invited in the last 30 days', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    await verifyAndSendInvite(...mockParams)
    expect(sgMail.send).not.toHaveBeenCalled()
  })

  it('if user has already been invite, it gives the appropriate error reason', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ email: 'test123' }],
    })
    const results = await verifyAndSendInvite(...mockParams)
    expect(results.error).toBe('user has been invited recently')
  })

  it('if the email fails to send, it gives the appropriate error reason', async () => {
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    sgMail.send.mockImplementation(new Error('error'))
    const results = await verifyAndSendInvite(...mockParams)
    expect(results.error).toBe('email failed to send')
  })
})
