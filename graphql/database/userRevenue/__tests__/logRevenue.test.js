/* eslint-env jest */

import moment from 'moment'
import { random } from 'lodash/number'
import UserRevenueModel from '../UserRevenueModel'
import logRevenue from '../logRevenue'
import {
  DatabaseOperation,
  setMockDBResponse,
  addTimestampFieldsToItem,
  getMockUserContext,
  mockDate,
} from '../../test-utils'
import decodeAmazonCPM from '../decodeAmazonCPM'

jest.mock('../decodeAmazonCPM')
jest.mock('../../databaseClient')
jest.mock('lodash/number')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  mockDate.off()
})

describe('logRevenue', () => {
  test('returns object with success: true', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const returned = await logRevenue(userContext, userId, 0.0172, '2468')
    expect(returned).toEqual({
      success: true,
    })
  })

  test('calls DB to create item with "revenue" argument', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    await logRevenue(userContext, userId, 0.0172, '2468')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
      })
    )
  })

  test('dfpAdvertiserId is optional', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    await logRevenue(userContext, userId, 0.0172)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
      })
    )
  })

  test('includes "tabId" when provided', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const someTabId = '712dca1a-3705-480f-95ff-314be86a2936'
    await logRevenue(userContext, userId, 0.0172, '2468', null, null, someTabId)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        tabId: someTabId,
      })
    )
  })

  test('includes "adSize" when provided', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const someTabId = '712dca1a-3705-480f-95ff-314be86a2936'
    await logRevenue(
      userContext,
      userId,
      0.0172,
      '2468',
      null,
      null,
      someTabId,
      '728x90'
    )

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        tabId: someTabId,
        adSize: '728x90',
      })
    )
  })

  test('includes "adUnitCode" when provided', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const someTabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const someAdUnitCode = '/24681357/blah-blah/'
    await logRevenue(
      userContext,
      userId,
      0.0172,
      '2468',
      null,
      null,
      someTabId,
      '728x90',
      someAdUnitCode
    )

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        tabId: someTabId,
        adSize: '728x90',
        adUnitCode: someAdUnitCode,
      })
    )
  })

  test('it throws an error if neither "revenue" nor "encodedRevenue" is provided', () => {
    expect.assertions(1)

    const userId = userContext.id
    return expect(logRevenue(userContext, userId)).rejects.toThrow(
      'Revenue logging requires either "revenue" or "encodedRevenue" values'
    )
  })

  test('it throws an error if both "revenue" nor "encodedRevenue" are provided but "aggregationOperation" is not', () => {
    expect.assertions(1)

    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    return expect(
      logRevenue(userContext, userId, 0.23, null, revenueObj, undefined)
    ).rejects.toThrow(
      'Revenue logging requires an "aggregationOperation" value if both "revenue" and "encodedRevenue" values are provided'
    )
  })

  test('it decodes an encoded Amazon CPM revenue object', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    await logRevenue(userContext, userId, null, null, revenueObj)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085,
      })
    )
  })

  test('it logs the ad size in the encoded Amazon CPM revenue object', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
      adSize: '300x250',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    await logRevenue(userContext, userId, null, null, revenueObj)

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085,
        adSize: '300x250',
      })
    )
  })

  test('it throws an error if a revenue object has an invalid transformation type', () => {
    expect.assertions(1)

    const userId = userContext.id
    const revenueObj = {
      encodingType: 'NOT_A_VALID_TYPE_HERE',
      encodedValue: 'some-code',
    }
    return expect(
      logRevenue(userContext, userId, null, null, revenueObj)
    ).rejects.toThrow(
      'Invalid "encodingType" field for revenue object transformation'
    )
  })

  test('it throws an error if an invalid "aggregationOperation" is provided', () => {
    expect.assertions(1)

    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    return expect(
      logRevenue(userContext, userId, 0.013, null, revenueObj, 'BLAH')
    ).rejects.toThrow(
      'Invalid "aggregationOperation" value. Must be one of: "MAX"'
    )
  })

  test('it chooses the max revenue value when using "MAX" aggregationOperation', async () => {
    expect.assertions(2)

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    await logRevenue(userContext, userId, 0.0072, null, revenueObj, 'MAX')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085,
      })
    )

    // Redo with a lower encoded revenue value.
    decodeAmazonCPM.mockReturnValueOnce(4.1)

    await logRevenue(userContext, userId, 0.0068, null, revenueObj, 'MAX')

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0068,
      })
    )
  })

  test('it selects the correct ad size when using "MAX" aggregationOperation', async () => {
    expect.assertions(2)
    const someTabId = '712dca1a-3705-480f-95ff-314be86a2936'

    const userId = userContext.id
    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
      adSize: '300x600',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(8.5)

    await logRevenue(
      userContext,
      userId,
      0.0072,
      null,
      revenueObj,
      'MAX',
      someTabId,
      '728x90'
    )

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0085,
        tabId: someTabId,
        adSize: '300x600', // The encoded revenue value was higher
      })
    )

    // Redo with a lower encoded revenue value.
    decodeAmazonCPM.mockReturnValueOnce(4.1)

    await logRevenue(
      userContext,
      userId,
      0.0068,
      null,
      revenueObj,
      'MAX',
      someTabId,
      '728x90'
    )

    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        revenue: 0.0068,
        tabId: someTabId,
        adSize: '728x90', // The non-encoded revenue value was higher
      })
    )
  })

  test('it throws an error if decoding throws an error', () => {
    expect.assertions(1)

    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockImplementation(() => {
      throw new Error('Big decoding problem!')
    })

    return expect(
      logRevenue(userContext, userId, null, null, revenueObj)
    ).rejects.toThrow('Big decoding problem!')
  })

  test('it throws an error if the decoded revenue object is null and there is no other revenue value', () => {
    expect.assertions(1)

    const userId = userContext.id
    const revenueObj = {
      encodingType: 'AMAZON_CPM',
      encodedValue: 'some-code',
    }

    // Mock decoding the Amazon code
    decodeAmazonCPM.mockReturnValueOnce(null)

    return expect(
      logRevenue(userContext, userId, null, null, revenueObj)
    ).rejects.toThrow('Amazon revenue code "some-code" resolved to a nil value')
  })

  test('retries with a new timestamp when a DB item already exists', async () => {
    expect.assertions(3)

    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')

    // Mock that the item already exists.
    setMockDBResponse(DatabaseOperation.CREATE, null, {
      code: 'ConditionalCheckFailedException',
    })

    // Control the random millisecond selection.
    random.mockReturnValueOnce(7)

    await logRevenue(userContext, userContext.id, 0.0172, '2468')
    expect(userRevenueCreate).toHaveBeenCalledTimes(2)
    expect(userRevenueCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userContext.id,
        timestamp: '2017-06-22T01:13:28.000Z',
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
      })
    )
    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userContext.id,
        timestamp: '2017-06-22T01:13:28.007Z', // Different time
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
      })
    )
  })

  test('throws an error when a DB item already exists twice in a row', async () => {
    expect.assertions(1)

    // Mock that the item already exists for the original and the
    // retried "create" operations.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      new Error({
        code: 'ConditionalCheckFailedException',
      })
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      new Error({
        code: 'ConditionalCheckFailedException',
      })
    )

    await expect(
      logRevenue(userContext, userContext.id, 0.0172, '2468')
    ).rejects.toThrow()
  })

  test('throws an error when the DB returns an unexpected error', async () => {
    expect.assertions(1)

    // Mock that the item already exists for the original and the
    // retried "create" operations.
    setMockDBResponse(DatabaseOperation.CREATE, null, {
      code: 'BadExampleError',
    })

    await expect(
      logRevenue(userContext, userContext.id, 0.0172, '2468')
    ).rejects.toThrow()
  })
})
