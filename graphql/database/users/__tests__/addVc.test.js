/* eslint-env jest */

import moment from 'moment'

import UserModel from '../UserModel'
import addVc from '../addVc'
import {
  DatabaseOperation,
  getMockUserObj,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

const userContext = getMockUserObj()

// Mock the database client. This allows us to test
// the DB operation with an unmocked ORM, which
// lets us catch query validation failures in tests.
jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('addVc', () => {
  it('calls the update method as expected', async () => {
    const updateMethod = jest.spyOn(UserModel, 'update')
    const userId = userContext.id
    const vcToAdd = 12
    await addVc(userContext, userId, vcToAdd)
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: userId,
      vcCurrent: {$add: vcToAdd},
      vcAllTime: {$add: vcToAdd},
      heartsUntilNextLevel: {$add: -vcToAdd},
      lastTabTimestamp: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
  })

  it('calls the database as expected', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    const userInfo = {
      id: userContext.id,
      username: userContext.username,
      email: userContext.email
    }
    const mockUser = Object.assign({}, new UserModel(userInfo))
    const expectedReturnedUser = Object.assign({}, mockUser, {
      updated: moment.utc().toISOString()
    })
    const dbUpdateMock = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )
    const returnedUser = await addVc(userContext, userId, vcToAdd)
    expect(dbUpdateMock).toHaveBeenCalled()
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
