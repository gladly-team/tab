/* eslint-env jest */

import UserModel from '../UserModel'
import addVcDonatedAllTime from '../addVcDonatedAllTime'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  setMockDBResponse,
} from '../../test-utils'

// Mock the database client. This allows us to test
// the DB operation with an unmocked ORM, which
// lets us catch query validation failures in tests.
jest.mock('../../databaseClient')

const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('addVcDonatedAllTime', () => {
  it('calls the update method as expected', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock response to updating VC.
    const userToReturn = Object.assign({}, getMockUserInstance(), {
      id: userId,
      addVcDonatedAllTime: 32,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => userToReturn)

    await addVcDonatedAllTime(userContext, userId, vcToAdd)
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: userId,
      vcDonatedAllTime: { $add: vcToAdd },
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      id: userId,
      vcDonatedAllTime: 32,
    })
    const dbUpdateMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })
    const returnedUser = await addVcDonatedAllTime(userContext, userId, vcToAdd)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
