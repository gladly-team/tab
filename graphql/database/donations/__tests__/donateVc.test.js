/* eslint-env jest */

import moment from 'moment'
import VCDonationModel from '../VCDonationModel'
import VCDonationByCharityModel from '../VCDonationByCharityModel'
import donateVc from '../donateVc'
import UserModel from '../../users/UserModel'
import addVcDonatedAllTime from '../../users/addVcDonatedAllTime'
import {
  MockAWSConditionalCheckFailedError,
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
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
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    jest.spyOn(VCDonationModel, 'create').mockImplementation(() => ({}))
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => getMockUserInstance())
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(updateMethod).toHaveBeenCalledWith(
      userContext,
      {
        id: userId,
        vcCurrent: { $add: -vcToDonate },
      },
      {
        ConditionExpression: '#vcCurrent >= :vcToDonate',
        ExpressionAttributeNames: {
          '#vcCurrent': 'vcCurrent',
        },
        ExpressionAttributeValues: {
          ':vcToDonate': vcToDonate,
        },
      }
    )
  })

  it('adds the donated VC to the all time count for that user', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(addVcDonatedAllTime).toHaveBeenCalledWith(userContext, userId, 14)
  })

  it('calls the database as expected to create the VcDonation item', async () => {
    expect.assertions(2)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 16

    const vcDonationCreateMethod = jest.spyOn(VCDonationModel, 'create')

    // Mock return values
    const expectedReturnedUser = getMockUserInstance()
    jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => getMockUserInstance())
    addVcDonatedAllTime.mockImplementationOnce(() => expectedReturnedUser)

    const returnVal = await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcDonationCreateMethod).toHaveBeenCalledWith(userContext, {
      userId,
      timestamp: moment.utc().toISOString(),
      charityId,
      vcDonated: vcToDonate,
    })
    expect(returnVal).toEqual({
      user: expectedReturnedUser,
      errors: null,
    })
  })

  it('returns an error if DynamoDB client throws ConditionalCheckFailedException', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 4000000

    setMockDBResponse(
      DatabaseOperation.UPDATE,
      null,
      new MockAWSConditionalCheckFailedError() // simple mock error
    )
    const returnedVal = await donateVc(
      userContext,
      userId,
      charityId,
      vcToDonate
    )
    expect(returnedVal).toEqual({
      user: null,
      errors: [
        {
          code: 'VC_INSUFFICIENT_TO_DONATE',
          message: `The user did not have the required ${vcToDonate} VC`,
        },
      ],
    })
  })

  it('updates the hourly VC donated to the charity', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    const vcByHourUpdateMethod = jest
      .spyOn(VCDonationByCharityModel, 'update')
      .mockImplementation(() => ({}))
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcByHourUpdateMethod).toHaveBeenCalledWith(
      expect.any(String), // the permissions override
      {
        charityId,
        timestamp: '2017-05-19T13:00:00.000Z',
        vcDonated: { $add: vcToDonate },
      }
    )
  })

  it('uses the permissions override to update the hourly VC donated to the charity', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    const vcByHourUpdateMethod = jest
      .spyOn(VCDonationByCharityModel, 'update')
      .mockImplementation(() => ({}))
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcByHourUpdateMethod.mock.calls[0][0]).toMatch(
      'ADD_VC_DONATED_BY_CHARITY_'
    )
  })

  it("creates the hourly VC donated to the charity if it doesn't already exist", async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14

    // The update fails because the item does not already exist.
    jest
      .spyOn(VCDonationByCharityModel, 'update')
      .mockImplementation(() =>
        Promise.reject(new MockAWSConditionalCheckFailedError())
      )

    const vcByHourCreateMethod = jest
      .spyOn(VCDonationByCharityModel, 'create')
      .mockImplementation(() => ({}))

    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcByHourCreateMethod).toHaveBeenCalledWith(
      expect.any(String), // the permissions override
      {
        charityId,
        timestamp: '2017-05-19T13:00:00.000Z',
        vcDonated: vcToDonate,
      }
    )
  })

  it('throws an error is something goes wrong when updating the hourly VC donated to the charity', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14

    jest
      .spyOn(VCDonationByCharityModel, 'update')
      .mockImplementation(() => Promise.reject(new Error('Some other error.')))

    await expect(
      donateVc(userContext, userId, charityId, vcToDonate)
    ).rejects.toThrow()
  })

  it('throws an error is something goes wrong when creating the hourly VC donated to the charity', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14

    // The update fails because the item does not already exist.
    jest
      .spyOn(VCDonationByCharityModel, 'update')
      .mockImplementation(() =>
        Promise.reject(new MockAWSConditionalCheckFailedError())
      )

    jest
      .spyOn(VCDonationByCharityModel, 'create')
      .mockImplementation(() => Promise.reject(new Error('Some other error.')))

    await expect(
      donateVc(userContext, userId, charityId, vcToDonate)
    ).rejects.toThrow()
  })
})
