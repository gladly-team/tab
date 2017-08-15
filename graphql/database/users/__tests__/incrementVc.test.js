/* eslint-env jest */

import incrementVc from '../incrementVc'
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

describe('incrementVc', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('increments the VC', async () => {
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

    const returnedUser = await incrementVc(userContext, userId)
    expect(addVc).toHaveBeenCalled()
    expect(returnedUser).not.toBeNull()
  })

  it('does not increment if was recently incremented', async () => {
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

    const returnedUser = await incrementVc(userContext, userId)
    expect(addVc).not.toHaveBeenCalled()
    expect(returnedUser).not.toBeNull()
  })
})
