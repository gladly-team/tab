/* eslint-env jest */

import moment from 'moment'

import UserModel from '../UserModel'
import addVc from '../addVc'
import {
  getMockUserObj,
  mockDate
} from '../../test-utils'

const user = getMockUserObj()

// Mock the database client. This allows us to test
// the DB operation with an unmocked ORM, which
// lets us catch query validation failures in tests.
jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('addVc', () => {
  it('works as expected', async () => {
    const updateMethod = jest.spyOn(UserModel, 'update')
    const userId = user.id
    const vcToAdd = 12
    await addVc(user, userId, vcToAdd)
    expect(updateMethod).toHaveBeenCalledWith(user, {
      id: userId,
      vcCurrent: {$add: vcToAdd},
      vcAllTime: {$add: vcToAdd},
      heartsUntilNextLevel: {$add: -vcToAdd},
      lastTabTimestamp: moment.utc().toISOString(),
      updated: moment.utc().toISOString()
    })
  })
})
