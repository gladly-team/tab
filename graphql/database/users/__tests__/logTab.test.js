/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import logTab from '../logTab'
import addVc from '../addVc'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../addVc')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true
  })
})

afterAll(() => {
  mockDate.off()
})

describe('logTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('when a valid tab, it increments the VC and valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    const returnedUser = await logTab(userContext, userId)

    // VC should increment.
    expect(addVc).toHaveBeenCalled()

    // It should update tabs and validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: {$add: 1},
      validTabs: {$add: 1},
      lastTabTimestamp: moment.utc().toISOString()
    })
    expect(returnedUser).not.toBeNull()
  })

  it('when an invalid tab, it does not increment VC or valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:26.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    const returnedUser = await logTab(userContext, userId)

    // VC should not increment.
    expect(addVc).not.toHaveBeenCalled()

    // It should update tabs but not validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: {$add: 1},
      lastTabTimestamp: moment.utc().toISOString()
    })
    expect(returnedUser).not.toBeNull()
  })
})
