/* eslint-env jest */

import moment from 'moment'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../../utils/experiments')

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

describe('logUserExperimentActions', () => {
  it('sets the testGroupSearchIntro value when it is provided', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentActions = {
      searchIntro: 2,
    }
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      testSearchIntroAction: 2,
      testSearchIntroActionTime: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('sets the testReferralNotificationAction value when it is provided', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentActions = {
      referralNotification: 1,
    }
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      testReferralNotificationAction: 1,
      testReferralNotificationActionTime: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('does not update the item when no experiment groups are provided', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentActions = {}
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('does not update the item when called with a null experimentGroups', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentActions = null
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('returns the user object when experiment groups are provided', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance(), {
      testGroupSearchIntro: 1,
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturnedUser,
    })

    const mockExperimentActions = {
      searchIntro: 1,
    }
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    const returnedUser = await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(returnedUser).toEqual(expectedReturnedUser)
  })

  it('returns the user object when no experiment groups are provided', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedUser = Object.assign({}, getMockUserInstance())
    setMockDBResponse(DatabaseOperation.GET, {
      Item: expectedReturnedUser,
    })

    const mockExperimentActions = {}
    const logUserExperimentActions = require('../logUserExperimentActions')
      .default
    const returnedUser = await logUserExperimentActions(
      userContext,
      userContext.id,
      mockExperimentActions
    )
    expect(returnedUser).toEqual(expectedReturnedUser)
  })
})
