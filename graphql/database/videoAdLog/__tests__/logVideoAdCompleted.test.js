/* eslint-env jest */
import {
  getMockUserContext,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'
import VideoAdLogModel from '../VideoAdLogModel'
import addVc from '../../users/addVc'

jest.mock('../../databaseClient')
jest.mock('../../users/addVc')
beforeAll(() => {
  mockDate.on()
})
afterEach(() => {
  clearAllMockDBResponses()
  jest.clearAllMocks()
})
afterAll(() => {
  mockDate.off()
})
const userContext = getMockUserContext()
const mockCreditProps = {
  userId: 'abcdefghijklmno',
  signatureArgumentString:
    'activity_id=14826&completed_at=2021-09-28T16:20:45.674Z&currency_amount=1&engagement_key=14826-Thz-BY4fz1y1DDpRBbT3s-1632846045&network_user_id=Thz-BY4fz1y1DDpRBbT3s&partner_config_hash=0c79a35271f1371e201a54744343a2ecf8ce9e7e',
  signature: '6c509af7ceb41cb0ca23fae53d9479e5b1343056bf744e4143dd02d97c2f69c5',
  videoAdId: 'bb7a085b-5363-40af-ab3e-31e69b352355',
  truexAdId: '14826-Thz-BY4fz1y1DDpRBbT3s-1632846045',
  truexCreativeId: '14826',
}
const mockStartedLog = {
  userId: 'abcdefghijklmno',
  timestamp: '2017-07-18T20:45:53Z',
  completed: false,
  id: 'bb7a085b-5363-40af-ab3e-31e69b352355',
}
const adLogUpdateSpy = jest.spyOn(VideoAdLogModel, 'update')
describe('logVideoAdCompleted', () => {
  it('successfully logs the video ad as complete and adds 100 vc', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock not credited
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock return started videoAdLog
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [mockStartedLog],
    })
    const result = await logVideoAdCompleted(userContext, mockCreditProps)
    expect(result.success).toEqual(true)
    expect(adLogUpdateSpy).toHaveBeenCalledWith(userContext, {
      ...mockStartedLog,
      completed: true,
      timestamp: '2017-07-18T20:45:53Z',
      truexCreativeId: mockCreditProps.truexCreativeId,
      truexEngagementId: mockCreditProps.truexAdId,
      updated: '2017-05-18T13:59:46.000Z',
    })
    expect(addVc).toHaveBeenCalledWith(userContext, userContext.id, 100)
  })

  it('returns a failure if user has already credited 3 video ads in the past 24 hours', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is not video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:45:53Z',
          completed: true,
          id: '9f2c0624-6410-4753-b196-06bd9ca767f6',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:45:53Z',
          completed: true,
          id: '9f2c0624-6410-4753-b196-06bd9ca767f6',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:45:53Z',
          completed: true,
          id: '9f2c0624-6410-4753-b196-06bd9ca767f6',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
      ],
    })
    const result = await logVideoAdCompleted(userContext, mockCreditProps)
    expect(result.success).toEqual(false)
    expect(adLogUpdateSpy).not.toHaveBeenCalled()
    expect(addVc).not.toHaveBeenCalled()
  })

  it('returns a failure if user has already credited for that particular ad log', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock already credited
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:45:53Z',
          completed: true,
          id: 'bb7a085b-5363-40af-ab3e-31e69b352355',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
      ],
    })
    const result = await logVideoAdCompleted(userContext, mockCreditProps)
    expect(result.success).toEqual(false)
    expect(adLogUpdateSpy).not.toHaveBeenCalled()
    expect(addVc).not.toHaveBeenCalled()
  })

  it('returns a failure if user sends a fake credit and video ad log was never created', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock already credited
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock return no started videoAdLog
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const result = await logVideoAdCompleted(userContext, mockCreditProps)
    expect(result.success).toEqual(false)
    expect(adLogUpdateSpy).not.toHaveBeenCalled()
    expect(addVc).not.toHaveBeenCalled()
  })

  it('returns a failure if user sends a fake signature', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock not credited
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock return started videoAdLog
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [mockStartedLog],
    })
    const result = await logVideoAdCompleted(userContext, {
      ...mockCreditProps,
      signature: 'fake-signature-wrongly-hashed',
    })
    expect(result.success).toEqual(false)
    expect(adLogUpdateSpy).not.toHaveBeenCalled()
    expect(addVc).not.toHaveBeenCalled()
  })

  it('returns a failure if user sends a fake argumentString', async () => {
    expect.assertions(3)
    const logVideoAdCompleted = require('../logVideoAdCompleted').default
    // Mock is video ad eligible
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock not credited
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    // Mock return started videoAdLog
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [mockStartedLog],
    })
    const result = await logVideoAdCompleted(userContext, {
      ...mockCreditProps,
      signatureArgumentString: 'fake-signatureArgumentString-wrongly-hashed',
    })
    expect(result.success).toEqual(false)
    expect(adLogUpdateSpy).not.toHaveBeenCalled()
    expect(addVc).not.toHaveBeenCalled()
  })
})
