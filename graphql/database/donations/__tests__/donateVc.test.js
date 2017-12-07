/* eslint-env jest */

import moment from 'moment'
import VCDonationModel from '../VCDonationModel'
import donateVc from '../donateVc'
import UserModel from '../../users/UserModel'
import addVcDonatedAllTime from '../../users/addVcDonatedAllTime'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../users/addVcDonatedAllTime')

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

describe('donateVc', () => {
  it('calls the database to subtract the donated VC from the user', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    jest.spyOn(VCDonationModel, 'create')
      .mockImplementation(() => {
        return {}
      })
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return getMockUserInstance()
      })
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(updateMethod).toHaveBeenCalledWith(userContext,
      {
        id: userId,
        vcCurrent: {$add: -vcToDonate}
      },
      {
        ConditionExpression: '#vcCurrent >= :vcToDonate',
        ExpressionAttributeNames: {
          '#vcCurrent': 'vcCurrent'
        },
        ExpressionAttributeValues: {
          ':vcToDonate': vcToDonate
        }
      }
    )
  })

  it('adds the donated VC to the all time count for that user', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(addVcDonatedAllTime).toHaveBeenCalledWith(userContext, userId, 14)
  })

  it('calls the database as expected to create the VcDonation item', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 16

    const vcDonationCreateMethod = jest.spyOn(VCDonationModel, 'create')

    // Mock return values
    const expectedReturnedUser = getMockUserInstance()
    jest.spyOn(UserModel, 'update')
    .mockImplementationOnce(() => {
      return getMockUserInstance()
    })
    addVcDonatedAllTime.mockImplementationOnce(() => {
      return expectedReturnedUser
    })

    const returnVal = await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcDonationCreateMethod).toHaveBeenCalledWith(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      charityId: charityId,
      vcDonated: vcToDonate
    })
    expect(returnVal).toEqual({
      user: expectedReturnedUser,
      errors: null
    })
  })

  it('returns an error if DynamoDB client throws ConditionalCheckFailedException', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 4000000

    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    const returnedVal = await donateVc(userContext, userId, charityId, vcToDonate)
    expect(returnedVal).toEqual({
      user: null,
      errors: [{
        code: 'VC_INSUFFICIENT_TO_DONATE',
        message: `The user did not have the required ${vcToDonate} VC`
      }]
    })
  })
})
