/* eslint-env jest */

import moment from 'moment'

import logReferralData from '../logReferralData'
import ReferralDataModel from '../ReferralDataModel'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('logReferralData', () => {
  it('calls the create method as expected', async () => {
    const userId = userContext.id
    const referringUserId = 'ab5082cc-151a-4a9a-9289-06906670fd4e'

    // Mock response to creating a referral log.
    const mockReferralLog = new ReferralDataModel({
      userId: userId,
      referringUser: referringUserId
    })
    const createMethod = jest.spyOn(ReferralDataModel, 'create')
      .mockImplementationOnce(() => {
        return mockReferralLog
      })
    const overrideVal = 'PLACEHOLDER'

    await logReferralData(userId, referringUserId)
    expect(createMethod).toHaveBeenCalledWith(overrideVal, {
      userId: userId,
      referringUser: referringUserId
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const referringUserId = 'ab5082cc-151a-4a9a-9289-06906670fd4e'
    const expectedReturnedLog = {
      userId: userId,
      referringUser: referringUserId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    }
    const dbCreateMock = setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const returnedReferralData = await logReferralData(userId, referringUserId)
    expect(dbCreateMock).toHaveBeenCalled()
    expect(returnedReferralData).toEqual(expectedReturnedLog)
  })
})
