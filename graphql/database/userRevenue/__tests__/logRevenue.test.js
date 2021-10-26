/* eslint-env jest */

import moment from 'moment'
import { random } from 'lodash/number'
import UserRevenueModel from '../UserRevenueModel'
import logRevenue from '../logRevenue'
import {
  MockAWSConditionalCheckFailedError,
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
      })
    )
  })

  test('includes isV4 when provided', async () => {
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
      someAdUnitCode,
      false
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
        isV4: false,
      })
    )
  })

  test('does not include causue ID when  isV4 is false', async () => {
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
      someAdUnitCode,
      false
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
        isV4: false,
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
        isV4: true,
        causeId: 'CA6A5C2uj',
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
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    // Control the random millisecond selection.
    random.mockReturnValueOnce(12).mockReturnValueOnce(18)

    await logRevenue(userContext, userContext.id, 0.0172, '2468')
    expect(userRevenueCreate).toHaveBeenCalledTimes(2)
    expect(userRevenueCreate).toHaveBeenCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userContext.id,
        timestamp: '2017-06-22T01:13:28.012Z',
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        isV4: true,
        causeId: 'CA6A5C2uj',
      })
    )
    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userContext.id,
        timestamp: '2017-06-22T01:13:28.018Z', // Different time
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        isV4: true,
        causeId: 'CA6A5C2uj',
      })
    )
  })

  test('retries five times when a DB item already exists', async () => {
    expect.assertions(1)

    const userRevenueCreate = jest.spyOn(UserRevenueModel, 'create')

    // Mock that the item already exists for the original and the
    // retried "create" operations.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    // Control the random millisecond selection.
    random
      .mockReturnValueOnce(12)
      .mockReturnValueOnce(18)
      .mockReturnValueOnce(17)
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(3)

    await logRevenue(userContext, userContext.id, 0.0172, '2468')
    expect(userRevenueCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userContext.id,
        timestamp: '2017-06-22T01:13:28.003Z', // Different time
        revenue: 0.0172,
        dfpAdvertiserId: '2468',
        isV4: true,
        causeId: 'CA6A5C2uj',
      })
    )
  })

  test('throws after 5 tries to log when a DB item already exists', async () => {
    expect.assertions(1)

    // Mock that the item already exists for the original and the
    // retried "create" operations.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    await expect(
      logRevenue(userContext, userContext.id, 0.0172, '2468')
    ).rejects.toThrow()
  })

  test('throws an error when the DB returns an unexpected error', async () => {
    expect.assertions(1)

    // Mock that the item already exists for the original and the
    // retried "create" operations.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      new Error({
        code: 'BadExampleError',
      })
    )

    await expect(
      logRevenue(userContext, userContext.id, 0.0172, '2468')
    ).rejects.toThrow()
  })
})
