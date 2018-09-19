/* eslint-env jest */

import moment from 'moment'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'
import {
  getValidatedExperimentGroups
} from '../../../utils/experiments'

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
  getValidatedExperimentGroups.mockReturnValue({})
})

describe('logUserExperimentGroups', () => {
  it('sets the testGroupAnonSignIn value when it is provided', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentGroups = {
      anonSignIn: 1
    }
    getValidatedExperimentGroups.mockReturnValueOnce(mockExperimentGroups)
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    await logUserExperimentGroups(userContext, userContext.id, mockExperimentGroups)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      testGroupAnonSignIn: 1,
      updated: moment.utc().toISOString()
    })
  })

  it('sets the testGroupAnonSignIn value even when it is zero', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentGroups = {
      anonSignIn: 0
    }
    getValidatedExperimentGroups.mockReturnValueOnce(mockExperimentGroups)
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    await logUserExperimentGroups(userContext, userContext.id, mockExperimentGroups)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      testGroupAnonSignIn: 0,
      updated: moment.utc().toISOString()
    })
  })

  it('does not update the item when no experiment groups are provided', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentGroups = {}
    getValidatedExperimentGroups.mockReturnValueOnce(mockExperimentGroups)
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    await logUserExperimentGroups(userContext, userContext.id, mockExperimentGroups)
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('does not update the item when called with a null experimentGroups', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    const mockExperimentGroups = null
    getValidatedExperimentGroups.mockReturnValueOnce({}) // Will return an empty object
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    await logUserExperimentGroups(userContext, userContext.id, mockExperimentGroups)
    expect(updateQuery).not.toHaveBeenCalled()
  })

  it('returns the user object when experiment groups are provided', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedUser = Object.assign(
      {},
      getMockUserInstance(),
      {
        testGroupAnonSignIn: 1
      }
    )
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedReturnedUser
      }
    )

    const mockExperimentGroups = {
      anonSignIn: 1
    }
    getValidatedExperimentGroups.mockReturnValueOnce(mockExperimentGroups)
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    const returnedUser = await logUserExperimentGroups(userContext, userContext.id,
      mockExperimentGroups)
    expect(returnedUser).toEqual(expectedReturnedUser)
  })

  it('returns the user object when no experiment groups are provided', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedUser = Object.assign(
      {},
      getMockUserInstance()
    )
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: expectedReturnedUser
      }
    )

    const mockExperimentGroups = {}
    getValidatedExperimentGroups.mockReturnValueOnce(mockExperimentGroups)
    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    const returnedUser = await logUserExperimentGroups(userContext, userContext.id,
      mockExperimentGroups)
    expect(returnedUser).toEqual(expectedReturnedUser)
  })

  it('does not save a test group value if it is invalid', async () => {
    expect.assertions(1)

    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')

    // Have the validated groups differ from provided.
    const mockExperimentGroups = {
      anonSignIn: 34543543
    }
    getValidatedExperimentGroups.mockReturnValueOnce({
      anonSignIn: null
    })

    const logUserExperimentGroups = require('../logUserExperimentGroups').default
    await logUserExperimentGroups(userContext, userContext.id, mockExperimentGroups)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      // Note: testGroupAnonSignIn not modified
      updated: moment.utc().toISOString()
    })
  })
})
