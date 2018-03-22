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
  test('calls DB to create item with "revenue" argument', async () => {
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

  test('includes "tabId" when provided', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const someTabId = '712dca1a-3705-480f-95ff-314be86a2936'
    await logRevenue(userContext, userId, 0.0172, '2468', null, null, someTabId)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        tabId: someTabId
      })
    )
  })

  test('it throws an error if neither "revenue" nor "encodedRevenue" is provided', () => {
    const userId = userContext.id
    return expect(logRevenue(userContext, userId))
      .rejects.toThrow('Revenue logging requires either "revenue" or "encodedRevenue" values')
  })

  test('it throws an error if both "revenue" nor "encodedRevenue" are provided but "aggregationOperation" is not', () => {
    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.50)

    return expect(logRevenue(userContext, userId, 0.23, null, revenueObj, undefined))
      .rejects.toThrow('Revenue logging requires an "aggregationOperation" value if both "revenue" and "encodedRevenue" values are provided')
  })

  test('it decodes an encoded Amazon CPM revenue object', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.50)

    await logRevenue(userContext, userId, null, null, revenueObj)

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
      encodingType: 'NOT_A_VALID_TYPE_HERE',
      encodedValue: 'some-code'
    }
    return expect(logRevenue(userContext, userId, null, null, revenueObj))
      .rejects.toThrow('Invalid "encodingType" field for revenue object transformation')
  })

  test('it throws an error if an invalid "aggregationOperation" is provided', () => {
    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.50)

    return expect(logRevenue(userContext, userId, 0.013, null, revenueObj, 'BLAH'))
      .rejects.toThrow('Invalid "aggregationOperation" value. Must be one of: "MAX"')
  })

  test('it chooses the max revenue value when using "MAX" aggregationOperation', async () => {
    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.50)

    await logRevenue(userContext, userId, 0.0072, null, revenueObj, 'MAX')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085
      })
    )

    // Redo with the a higher revenue value
    decodeAmazonCPM.mockReturnValueOnce(4.10)

    await logRevenue(userContext, userId, 0.0068, null, revenueObj, 'MAX')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0068
      })
    )
  })

  test('it throws an error if decoding throws an error', () => {
    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockImplementation(() => {
      throw new Error('Big decoding problem!')
    })

    return expect(logRevenue(userContext, userId, null, null, revenueObj))
      .rejects.toThrow('Big decoding problem!')
  })

  test('it throws an error if the decoded revenue object is null and there is no other revenue value', () => {
    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code'
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(null)

    return expect(logRevenue(userContext, userId, null, null, revenueObj))
      .rejects.toThrow('Amazon revenue code "some-code" resolved to a nil value')
  })
})
