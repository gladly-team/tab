/* eslint-env jest */

import UserModel from '../UserModel'
import {
  getMockUserObj,
  mockQueryMethods
} from '../../test-utils'

jest.mock('../../backgroundImages/backgroundImage')

const user = getMockUserObj()
mockQueryMethods(UserModel)

describe('addVc', () => {
  const mockTimestampVal = '2017-06-22T01:13:28Z'

  beforeAll(() => {
    // Mock Date for consistent timestamp.
    Date.now = jest.fn(() => 1498094008000)
  })

  it('works as expected', async () => {
    const userId = user.id
    const vcToAdd = 12
    await UserModel.addVc(user, userId, vcToAdd)
    expect(UserModel.update).toHaveBeenCalledWith(user, {
      id: userId,
      vcCurrent: {$add: vcToAdd},
      vcAllTime: {$add: vcToAdd},
      heartsUntilNextLevel: {$add: -vcToAdd},
      lastTabTimestamp: mockTimestampVal
    })
  })
})
