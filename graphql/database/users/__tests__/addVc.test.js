/* eslint-env jest */

import moment from 'moment'

import UserModel from '../UserModel'
import addVc from '../addVc'
import UserLevelModel from '../../userLevels/UserLevelModel'
import getNextLevelFor from '../../userLevels/getNextLevelFor'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

// Mock the database client. This allows us to test
// the DB operation with an unmocked ORM, which
// lets us catch query validation failures in tests.
jest.mock('../../databaseClient')
jest.mock('../../userLevels/getNextLevelFor')

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

describe('addVc', () => {
  it('calls the update method as expected', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock response to updating VC.
    const userToReturn = Object.assign(
      {},
      getMockUserInstance(),
      {
        id: userId,
        heartsUntilNextLevel: 4
      })
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return userToReturn
      })

    await addVc(userContext, userId, vcToAdd)
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: userId,
      vcCurrent: {$add: vcToAdd},
      vcAllTime: {$add: vcToAdd},
      heartsUntilNextLevel: {$add: -vcToAdd},
      lastTabTimestamp: moment.utc().toISOString()
    })

    // We should not call to get a new level because the
    // user did not level up.
    expect(getNextLevelFor).not.toHaveBeenCalled()
  })

  it('gets the next level for the user if they level up', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock response to updating VC.
    const userToReturn = Object.assign(
      {},
      getMockUserInstance(),
      {
        id: userId,
        level: 3,
        vcAllTime: 40,
        heartsUntilNextLevel: 0 // user should level up
      }
    )
    const finalReturnedUser = Object.assign({}, userToReturn, {
      level: 4,
      heartsUntilNextLevel: 10
    })
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return userToReturn
      })
      .mockImplementationOnce(() => {
        return finalReturnedUser
      })

    getNextLevelFor.mockImplementationOnce(() => {
      return new UserLevelModel({
        id: 4,
        hearts: 50
      })
    })

    const returnedUser = await addVc(userContext, userId, vcToAdd)

    // The user leveled up, so we should call to get a new level.
    expect(getNextLevelFor).toHaveBeenCalledWith(userContext, 3, 40)
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      level: 4,
      heartsUntilNextLevel: 10
    })
    expect(returnedUser).toEqual(finalReturnedUser)
  })

  it('calls the database as expected when the user does not level up', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock getting next level.
    getNextLevelFor.mockImplementationOnce(() => {
      return new UserLevelModel({
        id: 4,
        hearts: 50
      })
    })

    // Mock DB response.
    const expectedReturnedUser = Object.assign(
      {},
      getMockUserInstance(),
      {
        id: userId,
        heartsUntilNextLevel: 4
      }
    )
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

  it('calls the database as expected when the user levels up', async () => {
    const userId = userContext.id
    const vcToAdd = 12

    // Mock getting next level.
    getNextLevelFor.mockImplementationOnce(() => {
      return new UserLevelModel({
        id: 4,
        hearts: 50
      })
    })

    // Mock DB responses.
    const userToReturn = Object.assign(
      {},
      getMockUserInstance(),
      {
        id: userId,
        level: 3,
        heartsUntilNextLevel: 0
      }
    )
    const finalUserToReturn = Object.assign(
      {}, userToReturn, {
        level: 4,
        heartsUntilNextLevel: 10
      })
    const dbUpdateMockFirst = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: userToReturn
      }
    )
    const dbUpdateMockSecond = setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: finalUserToReturn
      }
    )
    const returnedUser = await addVc(userContext, userId, vcToAdd)
    expect(dbUpdateMockFirst).toHaveBeenCalled()
    expect(dbUpdateMockSecond).toHaveBeenCalled()
    expect(returnedUser).toEqual(finalUserToReturn)
  })
})
