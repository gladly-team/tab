/* eslint-env jest */

import moment from 'moment'
import VCDonationModel from '../VCDonationModel'
import donateVc from '../donateVc'
import addVc from '../../users/addVc'
import addVcDonatedAllTime from '../../users/addVcDonatedAllTime'
import {
  getMockUserContext,
  getMockUserInstance,
  mockDate
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../users/addVc')
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
  it('subtracts the donated VC from the user', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    jest.spyOn(VCDonationModel, 'create')
      .mockImplementation(() => {
        return {}
      })
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(addVc).toHaveBeenCalledWith(userContext, userId, -14)
  })

  it('adds the donated VC to the all time count for that user', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 14
    await donateVc(userContext, userId, charityId, vcToDonate)
    expect(addVcDonatedAllTime).toHaveBeenCalledWith(userContext, userId, 14)
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 16

    const vcDonationCreateMethod = jest.spyOn(VCDonationModel, 'create')

    // Mock return values
    const expectedReturnedUser = getMockUserInstance()
    addVc.mockImplementationOnce(() => {
      return expectedReturnedUser
    })
    addVcDonatedAllTime.mockImplementationOnce(() => {
      return expectedReturnedUser
    })

    const returnedUser = await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcDonationCreateMethod).toHaveBeenCalledWith(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      charityId: charityId,
      vcDonated: vcToDonate
    })
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
