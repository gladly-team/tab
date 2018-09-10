/* eslint-env jest */

import moment from 'moment'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('mergeIntoExistingUser', () => {
  it('works as expected', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mergeIntoExistingUser = require('../mergeIntoExistingUser').default
    await mergeIntoExistingUser(userContext, userContext.id)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      mergedIntoExistingUser: true,
      updated: moment.utc().toISOString()
    })
  })

  it('returns a "success" boolean', async () => {
    // Mock DB response.
    const expectedReturnedUser = Object.assign(
      {},
      getMockUserInstance(),
      {
        mergedIntoExistingUser: true
      }
    )
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )

    const mergeIntoExistingUser = require('../mergeIntoExistingUser').default
    const returnedUser = await mergeIntoExistingUser(userContext, userContext.id)
    expect(returnedUser).toEqual({
      success: true
    })
  })
})
