/* eslint-env jest */

import UserModel from '../UserModel'
import addUsersRecruited from '../addUsersRecruited'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')

const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('addUsersRecruited', () => {
  it('calls the update method as expected', async () => {
    const referringUserId = userContext.id
    const numUsersRecruited = 1

    // Mock response to updating VC.
    const userToReturn = Object.assign({}, getMockUserInstance(), {
      id: referringUserId,
      numUsersRecruited: 4,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => userToReturn)

    await addUsersRecruited(referringUserId, numUsersRecruited)
    const updateMethodCalledParams = updateMethod.mock.calls[0]
    expect(updateMethodCalledParams[0]).toMatch(
      /ADD_NUM_USERS_RECRUITED_OVERRIDE_CONFIRMED_[0-9]{5}$/
    )
    expect(updateMethodCalledParams[1]).toEqual({
      id: referringUserId,
      numUsersRecruited: { $add: numUsersRecruited },
    })
  })

  it('calls the database as expected', async () => {
    const referringUserId = userContext.id
    const numUsersRecruited = 1

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      id: referringUserId,
      numUsersRecruited: 4,
    })

    await addUsersRecruited(referringUserId, numUsersRecruited)

    const dbUpdateMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })
    const returnedUser = await addUsersRecruited(
      referringUserId,
      numUsersRecruited
    )
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
