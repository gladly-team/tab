/* eslint-env jest */

import UserImpactModel from '../UserImpactModel'
import getUserImpact from '../getUserImpact'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
  getMockCauseInstance,
} from '../../test-utils'
import getCause from '../../cause/getCause'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../../cause/getCause')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})
beforeEach(() => {
  jest.clearAllMocks()
})
const userId = userContext.id

describe('getUserImpact', () => {
  it('gets the user impact mapped to cause id on user', async () => {
    const mockUser = getMockUserInstance({ causeId: 'mock-cause-id' })
    const mockCause = getMockCauseInstance({
      id: 'mock-cause-id',
      charityId: 'mock-charity-id',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    getCause.mockReturnValueOnce(mockCause)
    const getOrCreate = jest.spyOn(UserImpactModel, 'getOrCreate')
    await getUserImpact(userContext, userId)
    expect(getOrCreate).toHaveBeenCalledWith(userContext, {
      userId: 'abcdefghijklmno',
      charityId: 'mock-charity-id',
      created: '2017-06-22T01:13:28.000Z',
      updated: '2017-06-22T01:13:28.000Z',
    })
  })

  it('gets the default cats user impact when no causeId', async () => {
    const mockUser = getMockUserInstance()
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const getOrCreate = jest.spyOn(UserImpactModel, 'getOrCreate')
    await getUserImpact(userContext, userId)
    expect(getOrCreate).toHaveBeenCalledWith(userContext, {
      userId: 'abcdefghijklmno',
      charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
      created: '2017-06-22T01:13:28.000Z',
      updated: '2017-06-22T01:13:28.000Z',
    })
  })
})
