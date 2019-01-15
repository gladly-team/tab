/* eslint-env jest */

import {
  DatabaseOperation,
  getMockUserContext,
  setMockDBResponse,
} from '../../test-utils'

import VCDonationByCharityModel from '../VCDonationByCharityModel'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()
const mockCharityId = '3caf69b6-9803-4495-9a5c-5ae0316bf367'

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCharityVcReceived', () => {
  it('calls the database', async () => {
    expect.assertions(2)

    const getCharityVcReceived = require('../getCharityVcReceived').default
    const query = jest.spyOn(VCDonationByCharityModel, 'query')
    const queryExec = jest.spyOn(VCDonationByCharityModel, '_execAsync')
    const mockStartTime = '2017-07-19T03:05:12.000Z'
    const mockEndTime = '2017-07-20T12:29:03.000Z'

    await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )
    expect(query).toHaveBeenCalledWith(userContext, mockCharityId)
    expect(queryExec).toHaveBeenCalled()
  })

  it('forms the database query as expected, rounding start and end times to hour buckets', async () => {
    expect.assertions(1)

    const getCharityVcReceived = require('../getCharityVcReceived').default

    // Mock VCDonationByCharityModel query
    const referralLogQueryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const mockStartTime = '2017-07-19T03:05:12.000Z'
    const mockEndTime = '2017-07-20T12:29:03.000Z'
    await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )

    expect(referralLogQueryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#charityId': 'charityId',
      },
      ExpressionAttributeValues: {
        ':timestamp': '2017-07-19T03:00:00.000Z',
        ':timestamp_2': '2017-07-20T12:59:59.999Z',
        ':charityId': mockCharityId,
      },
      KeyConditionExpression:
        '(#timestamp BETWEEN :timestamp AND :timestamp_2) AND (#charityId = :charityId)',
      TableName: VCDonationByCharityModel.tableName,
    })
  })

  it('returns zero when the query returns no items ', async () => {
    expect.assertions(1)

    const getCharityVcReceived = require('../getCharityVcReceived').default

    // Mock VCDonationByCharityModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const mockStartTime = '2017-07-19T03:05:12.000Z'
    const mockEndTime = '2017-07-20T12:29:03.000Z'
    const totalVc = await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )
    expect(totalVc).toBe(0)
  })

  it('returns the sum of VC when the query returns items ', async () => {
    expect.assertions(1)

    const getCharityVcReceived = require('../getCharityVcReceived').default

    // Mock VCDonationByCharityModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          charityId: mockCharityId,
          timestamp: '2017-07-19T03:00:00.000Z',
          vcDonated: 16,
        },
        {
          charityId: mockCharityId,
          timestamp: '2017-07-19T04:00:00.000Z',
          vcDonated: 231,
        },
        {
          charityId: mockCharityId,
          timestamp: '2017-07-19T05:00:00.000Z',
          vcDonated: 34,
        },
      ],
    })
    const mockStartTime = '2017-07-19T03:43:12.000Z'
    const mockEndTime = '2017-07-19T05:29:03.000Z'
    const totalVc = await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )
    expect(totalVc).toBe(281)
  })

  it('includes a full hour of VC when the start and end times are a partial hour', async () => {
    expect.assertions(1)

    const getCharityVcReceived = require('../getCharityVcReceived').default
    const referralLogQueryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const mockStartTime = '2017-07-19T03:14:12.932Z'
    const mockEndTime = '2017-07-19T03:18:55.122Z'
    await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )

    expect(referralLogQueryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#charityId': 'charityId',
      },
      ExpressionAttributeValues: {
        ':timestamp': '2017-07-19T03:00:00.000Z',
        ':timestamp_2': '2017-07-19T03:59:59.999Z',
        ':charityId': mockCharityId,
      },
      KeyConditionExpression:
        '(#timestamp BETWEEN :timestamp AND :timestamp_2) AND (#charityId = :charityId)',
      TableName: VCDonationByCharityModel.tableName,
    })
  })

  it('excludes the end hour when the end time is set to the exact start of the hour', async () => {
    expect.assertions(1)

    const getCharityVcReceived = require('../getCharityVcReceived').default
    const referralLogQueryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const mockStartTime = '2017-07-19T01:00:00.000Z'
    const mockEndTime = '2017-07-19T05:00:00.000Z'
    await getCharityVcReceived(
      userContext,
      mockCharityId,
      mockStartTime,
      mockEndTime
    )

    expect(referralLogQueryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#charityId': 'charityId',
      },
      ExpressionAttributeValues: {
        ':timestamp': '2017-07-19T01:00:00.000Z',
        ':timestamp_2': '2017-07-19T04:59:59.999Z',
        ':charityId': mockCharityId,
      },
      KeyConditionExpression:
        '(#timestamp BETWEEN :timestamp AND :timestamp_2) AND (#charityId = :charityId)',
      TableName: VCDonationByCharityModel.tableName,
    })
  })
})
