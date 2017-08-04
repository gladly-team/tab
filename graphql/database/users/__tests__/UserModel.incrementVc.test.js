/* eslint-env jest */

import UserModel from '../UserModel'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

jest.mock('../../backgroundImages/backgroundImage')

const user = getMockUserObj()
mockQueryMethods(UserModel)

describe('incrementVc', () => {
  const mockTimestampVal = '2017-06-22T01:13:28Z'

  beforeEach(() => {
    jest.resetAllMocks()

    // Mock Date for consistent timestamp.
    Date.now = jest.fn(() => 1498094008000)
  })

  it('increments the VC', async () => {
    const userId = user.id

    // Mock fetching the user.
    UserModel.get = jest.fn(() => {
      return Promise.resolve({
        lastTabTimestamp: '2017-06-22T01:13:25Z'
      })
    })

    await UserModel.incrementVc(user, userId)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      vcCurrent: {$add: 1},
      vcAllTime: {$add: 1},
      heartsUntilNextLevel: {$add: -1},
      lastTabTimestamp: mockTimestampVal
    })
  })

  it('does not increment if was recently incremented', async () => {
    const userId = user.id

    // Mock fetching the user.
    UserModel.get = jest.fn(() => {
      return Promise.resolve({
        lastTabTimestamp: '2017-06-22T01:13:27Z'
      })
    })
    await UserModel.incrementVc(user, userId)
    expect(UserModel.update).not.toHaveBeenCalled()
  })
})
