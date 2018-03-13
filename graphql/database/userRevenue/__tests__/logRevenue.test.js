/* eslint-env jest */

import moment from 'moment'
import UserRevenueModel from '../UserRevenueModel'
import logRevenue from '../logRevenue'
import {
  addTimestampFieldsToItem,
  getMockUserContext,
  mockDate
} from '../../test-utils'
import decodeAmazonCPM from '../decodeAmazonCPM'

jest.mock('../decodeAmazonCPM')
jest.mock('../../databaseClient')

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

describe('logRevenue', () => {
  test('calls DB to create item', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    await logRevenue(userContext, userId, 0.0172, '2468')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468'
      })
    )
  })

  test('dfpAdvertiserId is optional', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    await logRevenue(userContext, userId, 0.0172)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172
      })
    )
  })

  test('it transforms an encoded Amazon CPM revenue object', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      type: 'AMAZON_CPM',
      code: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.50)

    await logRevenue(userContext, userId, revenueObj)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085
      })
    )
  })

  test('it throws an error if a revenue object has an invalid transformation type', () => {
    const userId = userContext.id
    const revenueObj = {
      type: 'NOT_A_VALID_TYPE_HERE',
      code: 'some-code'
    }
    return expect(logRevenue(userContext, userId, revenueObj))
      .rejects.toThrow()
  })
})
