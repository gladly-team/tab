/* eslint-env jest */

import UserModel from '../UserModel'
import incrementVc from '../incrementVc'
import {
  getMockUserObj,
  mockDate,
  mockQueryMethods
} from '../../test-utils'

const user = getMockUserObj()
mockQueryMethods(UserModel)

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
    jest.resetAllMocks()
  })

  it('increments the VC', async () => {
    const userId = user.id

    // Mock fetching the user.
    UserModel.get = jest.fn(() => {
      return Promise.resolve({
        lastTabTimestamp: '2017-06-22T01:13:25.000Z'
      })
    })

    await incrementVc(user, userId)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      vcCurrent: {$add: 1},
      vcAllTime: {$add: 1},
      heartsUntilNextLevel: {$add: -1},
      lastTabTimestamp: mockCurrentTime
    })
  })

  it('does not increment if was recently incremented', async () => {
    const userId = user.id

    // Mock fetching the user.
    UserModel.get = jest.fn(() => {
      return Promise.resolve({
        lastTabTimestamp: '2017-06-22T01:13:27.000Z'
      })
    })
    await incrementVc(user, userId)
    expect(UserModel.update).not.toHaveBeenCalled()
  })
})
