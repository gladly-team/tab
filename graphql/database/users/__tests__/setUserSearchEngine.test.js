/* eslint-env jest */

import moment from 'moment'
import logger from '../../../utils/logger'
import { DEFAULT_SEARCH_ENGINE } from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../../utils/logger')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
  clearAllMockDBResponses()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setUserSearchEngine', () => {
  it('sets searchEngine and creates a UserSearchSettingsLog for user with no previous search engine', async () => {
    const UserModel = require('../UserModel').default
    const UserSearchSettingsLogModel =
      require('../UserSearchSettingsLogModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const logCreateQuery = jest.spyOn(UserSearchSettingsLogModel, 'create')
    const setUserSearchEngine = require('../setUserSearchEngine').default
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: '7f8476b9-f83f-47ac-8173-4a1c2ec3dc29',
    })
    const testEngine = 'DuckDuckGo'
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updatedUser = {
      ...mockUser,
      searchEngine: testEngine,
    }
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: updatedUser,
    })
    const result = await setUserSearchEngine(
      userContext,
      userContext.id,
      testEngine
    )
    expect(result).toEqual(updatedUser)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      searchEngine: testEngine,
      updated: moment.utc().toISOString(),
    })
    expect(logCreateQuery).toHaveBeenCalledWith(userContext, {
      userId,
      previousEngine: DEFAULT_SEARCH_ENGINE,
      newEngine: testEngine,
      updated: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      timestamp: moment.utc().toISOString(),
    })
  })

  it('sets searchEngine and creates a UserSearchSettingsLog for user with a previous search engine', async () => {
    const UserModel = require('../UserModel').default
    const UserSearchSettingsLogModel =
      require('../UserSearchSettingsLogModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const logCreateQuery = jest.spyOn(UserSearchSettingsLogModel, 'create')
    const setUserSearchEngine = require('../setUserSearchEngine').default
    const userId = userContext.id
    const searchEngine = 'Ecosia'
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: '7f8476b9-f83f-47ac-8173-4a1c2ec3dc29',
      searchEngine,
    })
    const testEngine = 'DuckDuckGo'
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updatedUser = {
      ...mockUser,
      searchEngine: testEngine,
    }
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: updatedUser,
    })
    const result = await setUserSearchEngine(
      userContext,
      userContext.id,
      testEngine
    )
    expect(result).toEqual(updatedUser)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userId,
      searchEngine: testEngine,
      updated: moment.utc().toISOString(),
    })
    expect(logCreateQuery).toHaveBeenCalledWith(userContext, {
      userId,
      previousEngine: searchEngine,
      newEngine: testEngine,
      updated: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      timestamp: moment.utc().toISOString(),
    })
  })

  it('doesnt create a log if new engine is same as previous search engine', async () => {
    const UserModel = require('../UserModel').default
    const UserSearchSettingsLogModel =
      require('../UserSearchSettingsLogModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const logCreateQuery = jest.spyOn(UserSearchSettingsLogModel, 'create')
    const setUserSearchEngine = require('../setUserSearchEngine').default
    const userId = userContext.id
    const searchEngine = 'Ecosia'
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: '7f8476b9-f83f-47ac-8173-4a1c2ec3dc29',
      searchEngine,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const result = await setUserSearchEngine(
      userContext,
      userContext.id,
      searchEngine
    )
    expect(result).toEqual(mockUser)
    expect(updateQuery).not.toHaveBeenCalled()
    expect(logCreateQuery).not.toHaveBeenCalled()
  })

  it('throws if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setUserSearchEngine = require('../setUserSearchEngine').default
    await expect(
      setUserSearchEngine(userContext, userContext.id, 'Ecosia')
    ).rejects.toThrow(mockErr)
  })

  it('logs an error if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setUserSearchEngine = require('../setUserSearchEngine').default

    try {
      await setUserSearchEngine(userContext, userContext.id, 'Ecosia')
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
