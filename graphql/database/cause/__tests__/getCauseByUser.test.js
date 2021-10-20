/* eslint-env jest */
import {
  DatabaseOperation,
  getMockUserContext,
  setMockDBResponse,
  getMockUserInstance,
} from '../../test-utils'

// We don't mock getCause.js.
jest.mock('../../databaseClient')

const MOCK_CAUSE_1 = {
  id: 'mock-cause-id',
  charityId: 'some-id-1',
  landingPagePath: '/foo',
}
const MOCK_CAUSE_2 = {
  id: 'mock-cause-id-2',
  charityId: 'some-id-2',
  landingPagePath: '/bar',
}

jest.mock('../causes', () => {
  return [MOCK_CAUSE_1, MOCK_CAUSE_2]
})

afterEach(() => {
  jest.resetModules()
})

describe('getCauseByUser', () => {
  it('gets the user cause mapped to cause id on user', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'mock-cause-id-2',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const getCauseByUser = require('../getCauseByUser').default
    const cause = await getCauseByUser(userContext, userId)
    expect(cause).toEqual(MOCK_CAUSE_2)
  })

  it('throws if the cause does not exist', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'blah-blah', // does not exist
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const getCauseByUser = require('../getCauseByUser').default
    await expect(getCauseByUser(userContext, userId)).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )
  })
})
