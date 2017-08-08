/* eslint-env jest */

import UserModel from '../UserModel'
import addVc from '../addVc'
import {
  getMockUserObj
} from '../../test-utils'

const user = getMockUserObj()

// Mock the database client. This allows us to test
// the DB operation with an unmocked ORM, which
// lets us catch query validation failures in tests.
jest.mock('../../databaseClient')

describe('addVc', () => {
  // const mockTimestampVal = '2017-06-22T01:13:28Z'

  beforeAll(() => {
    // Mock Date for consistent timestamp.
    Date.now = jest.fn(() => 1498094008000)
  })

  it('works as expected', async () => {
    const updateMethod = jest.spyOn(UserModel, 'update')
    const userId = user.id
    const vcToAdd = 12
    await addVc(user, userId, vcToAdd)
    expect(updateMethod).toHaveBeenCalled()
    // FIXME: need consisted date for 'updated' field
    // expect(updateMethod).toHaveBeenCalledWith(user, {
    //   id: userId,
    //   vcCurrent: {$add: vcToAdd},
    //   vcAllTime: {$add: vcToAdd},
    //   heartsUntilNextLevel: {$add: -vcToAdd},
    //   lastTabTimestamp: mockTimestampVal
    // })
  })
})
