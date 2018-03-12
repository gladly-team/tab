/* eslint-env jest */

// import moment from 'moment'
// import UserRevenueModel from '../UserRevenueModel'
// import logRevenue from '../logRevenue'
import {
  // addTimestampFieldsToItem,
  // getMockUserContext,
  mockDate
} from '../../test-utils'

jest.mock('../../databaseClient')

// const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true
  })
})

afterAll(() => {
  mockDate.off()
})

describe('logRevenue', () => {
  test('foo', () => {
    expect(true).toBe(true)
  })

  // test('calls DB to create item', async () => {
  //   const userId = userContext.id
  //   const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
  //   await logRevenue(userContext, userId, 0.0172, 2468)

  //   expect(userRevenueCreate).toHaveBeenLastCalledWith(
  //     userContext,
  //     addTimestampFieldsToItem({
  //       userId: userId,
  //       timestamp: moment.utc().toISOString(),
  //       revenue: 0.0172,
  //       dfpAdvertiserId: 2468
  //     })
  //   )
  // })

  // test('dfpAdvertiserId is optional', async () => {
  //   const userId = userContext.id
  //   const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
  //   await logRevenue(userContext, userId, 0.0172)

  //   expect(userRevenueCreate).toHaveBeenLastCalledWith(
  //     userContext,
  //     addTimestampFieldsToItem({
  //       userId: userId,
  //       timestamp: moment.utc().toISOString(),
  //       revenue: 0.0172
  //     })
  //   )
  // })
})
