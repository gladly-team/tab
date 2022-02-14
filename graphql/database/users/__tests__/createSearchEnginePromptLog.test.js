/* eslint-env jest */
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
} from '../../test-utils'
import { UnauthorizedQueryException } from '../../../utils/exceptions'

jest.mock('../../databaseClient')
beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})
const testEngine = 'Google'
const switched = true
const userContext = getMockUserContext()
const user = getMockUserInfo()
const mockReturn = {
  userId: 'abcdefghijklmno',
  searchEnginePrompted: testEngine,
  switched: true,
  timestamp: '2017-05-19T13:59:46.000Z',
  created: '2017-05-19T13:59:46.000Z',
  updated: '2017-05-19T13:59:46.000Z',
}
describe('createSearchEnginePromptLog tests', () => {
  it('creates new UserSwitchSearchPromptLogModel', async () => {
    expect.assertions(2)
    const createSearchEnginePromptLog = require('../createSearchEnginePromptLog')
      .default
    // Mock creation query
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: mockReturn,
    })
    const UserSwitchSearchPromptLogModel = require('../UserSwitchSearchPromptLogModel')
      .default
    const createQuery = jest.spyOn(UserSwitchSearchPromptLogModel, 'create')
    const result = await createSearchEnginePromptLog(
      userContext,
      user.id,
      testEngine,
      switched
    )
    expect(createQuery).toHaveBeenCalledWith(userContext, {
      userId: userContext.id,
      searchEnginePrompted: testEngine,
      switched,
      timestamp: '2017-05-19T13:59:46.000Z',
      created: '2017-05-19T13:59:46.000Z',
      updated: '2017-05-19T13:59:46.000Z',
    })
    expect(result).toEqual({ success: true })
  })

  it('throws if invalid search engine for new UserSwitchSearchPromptLogModel', async () => {
    expect.assertions(1)
    const createSearchEnginePromptLog = require('../createSearchEnginePromptLog')
      .default
    await expect(
      createSearchEnginePromptLog(
        userContext,
        user.id,
        'not-real-engine',
        switched
      )
    ).rejects.toThrow()
  })

  it('throws if user id does not match user context', async () => {
    expect.assertions(1)
    const createSearchEnginePromptLog = require('../createSearchEnginePromptLog')
      .default
    await expect(
      createSearchEnginePromptLog(userContext, 'wrongid')
    ).rejects.toThrow(new UnauthorizedQueryException())
  })
})
