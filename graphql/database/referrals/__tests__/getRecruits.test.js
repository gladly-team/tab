/* eslint-env jest */

import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  setMockDBResponse
} from '../../test-utils'

import ReferralDataModel from '../ReferralDataModel'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getRecruits', () => {
  test('getRecruits calls the database', async () => {
    const referringUserId = getMockUserInfo().id
    const getRecruits = require('../getRecruits').getRecruits

    // Spy on query methods
    const query = jest.spyOn(ReferralDataModel, 'query')
    const queryExec = jest.spyOn(ReferralDataModel, '_execAsync')

    await getRecruits(userContext, referringUserId)

    expect(query).toHaveBeenCalledWith(userContext, referringUserId)
    expect(queryExec).toHaveBeenCalled()
  })

  it('getRecruits (with no time filters) forms database queries and return value as expected', async () => {
    const referringUserId = getMockUserInfo().id
    const getRecruits = require('../getRecruits').getRecruits

    // From ReferralDataModel query
    const itemsToReturn = [
      {
        userId: 'efghijklmnopqrs',
        referringUser: referringUserId,
        created: '2017-07-19T03:05:12Z',
        updated: '2017-07-19T03:05:12Z'
      },
      {
        userId: 'pqrstuvwxyzabcd',
        referringUser: referringUserId,
        created: '2017-08-20T17:32:01Z',
        updated: '2017-08-20T17:32:01Z'
      }
    ]
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.QUERY,
      {
        Items: itemsToReturn
      }
    )
    const returnedVal = await getRecruits(userContext, referringUserId)
    expect(dbQueryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#referringUser': 'referringUser'
      },
      ExpressionAttributeValues: {
        ':referringUser': referringUserId
      },
      IndexName: 'ReferralsByReferrer',
      KeyConditionExpression: '(#referringUser = :referringUser)',
      TableName: ReferralDataModel.tableName
    })

    const expectedReturn = [
      {
        recruitedAt: '2017-07-19T03:05:12Z',
        activeForAtLeastOneDay: true
      },
      {
        recruitedAt: '2017-08-20T17:32:01Z',
        activeForAtLeastOneDay: true
      }
    ]
    expect(returnedVal).toEqual(expectedReturn)
  })

  // TODO: test with time filters

  test('getTotalRecruitsCount works as expected', async () => {
    const getTotalRecruitsCount = require('../getRecruits').getTotalRecruitsCount
    const recruitsEdgesTestA = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: false
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          activeForAtLeastOneDay: false
        }
      }
    ]
    expect(getTotalRecruitsCount(recruitsEdgesTestA)).toBe(3)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      }
    ]
    expect(getTotalRecruitsCount(recruitsEdgesTestB)).toBe(2)

    const recruitsEdgesTestC = []
    expect(getTotalRecruitsCount(recruitsEdgesTestC)).toBe(0)

    expect(getTotalRecruitsCount(null)).toBe(0)
  })

  test('getRecruitsActiveForAtLeastOneDay works as expected', async () => {
    const getRecruitsActiveForAtLeastOneDay = require('../getRecruits')
      .getRecruitsActiveForAtLeastOneDay
    const recruitsEdgesTestA = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: false
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          activeForAtLeastOneDay: false
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestA)).toBe(1)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          activeForAtLeastOneDay: true
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestB)).toBe(2)

    const recruitsEdgesTestC = []
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestC)).toBe(0)

    expect(getRecruitsActiveForAtLeastOneDay(null)).toBe(0)
  })
})
