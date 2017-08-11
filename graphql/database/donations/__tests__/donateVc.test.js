/* eslint-env jest */

import VCDonationModel from '../VCDonationModel'
import donateVc from '../donateVc'
import addVc from '../../users/addVc'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../users/addVc')

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

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const charityId = 'bb5082cc-151a-4a9a-9289-06906670fd4e'
    const vcToDonate = 16

    const vcDonationCreateMethod = jest.spyOn(VCDonationModel, 'create')
    setMockDBResponse(
      DatabaseOperation.CREATE,
      {
        Attributes: {}
      }
    )
    const expectedReturnedUser = getMockUserInstance()
    addVc.mockImplementationOnce(() => {
      return expectedReturnedUser
    })

    const returnedUser = await donateVc(userContext, userId, charityId, vcToDonate)
    expect(vcDonationCreateMethod).toHaveBeenCalledWith(userContext, {
      userId: userId,
      charityId: charityId,
      vcDonated: vcToDonate
    })
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
