/* eslint-env jest */

import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  setMockDBResponse
} from '../../test-utils'

import ReferralDataModel from '../ReferralDataModel'
import UserModel from '../../users/UserModel'

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

  test('getRecruits (with no time filters) forms database queries and returns expected value', async () => {
    const referringUserId = getMockUserInfo().id
    const getRecruits = require('../getRecruits').getRecruits

    // Mock ReferralDataModel query
    const referralDataLogsToReturn = [
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
    const referralLogQueryMock = setMockDBResponse(
      DatabaseOperation.QUERY,
      {
        Items: referralDataLogsToReturn
      }
    )

    // Mock User query
    const recruitedUsersToReturn = [
      {
        id: 'efghijklmnopqrs',
        lastTabTimestamp: '2017-07-21T05:15:00Z' // >2 days after joining
      },
      {
        id: 'pqrstuvwxyzabcd',
        lastTabTimestamp: '2017-08-20T17:40:52Z' // <1 hour after joining
      }
    ]
    setMockDBResponse(
      DatabaseOperation.GET_BATCH,
      {
        Responses: {
          [UserModel.tableName]: recruitedUsersToReturn
        }
      }
    )

    const returnedVal = await getRecruits(userContext, referringUserId)
    expect(referralLogQueryMock.mock.calls[0][0]).toEqual({
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
        lastActive: '2017-07-21T05:15:00Z'
      },
      {
        recruitedAt: '2017-08-20T17:32:01Z',
        lastActive: '2017-08-20T17:40:52Z'
      }
    ]
    expect(returnedVal).toEqual(expectedReturn)
  })

  test('getRecruits (with missing lastTabTimestamp values) returns expected value', async () => {
    const referringUserId = getMockUserInfo().id
    const getRecruits = require('../getRecruits').getRecruits

    // Mock ReferralDataModel query
    const referralDataLogsToReturn = [
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
      },
      {
        userId: 'tuvwxyzabcdefgh',
        referringUser: referringUserId,
        created: '2017-07-23T01:18:11Z',
        updated: '2017-07-23T01:18:11Z'
      }
    ]
    setMockDBResponse(
      DatabaseOperation.QUERY,
      {
        Items: referralDataLogsToReturn
      }
    )

    // Mock User query
    const recruitedUsersToReturn = [
      {
        id: 'efghijklmnopqrs',
        lastTabTimestamp: null // no timestamp
      },
      {
        id: 'pqrstuvwxyzabcd',
        lastTabTimestamp: '2017-08-20T17:40:52Z' // valid
      },
      {
        // missing lastTabTimestamp field
        id: 'tuvwxyzabcdefgh'
      }
    ]
    setMockDBResponse(
      DatabaseOperation.GET_BATCH,
      {
        Responses: {
          [UserModel.tableName]: recruitedUsersToReturn
        }
      }
    )

    const returnedVal = await getRecruits(userContext, referringUserId)

    const expectedReturn = [
      {
        recruitedAt: '2017-07-19T03:05:12Z',
        lastActive: null
      },
      {
        recruitedAt: '2017-08-20T17:32:01Z',
        lastActive: '2017-08-20T17:40:52Z'
      },
      {
        recruitedAt: '2017-07-23T01:18:11Z',
        lastActive: null
      }
    ]
    expect(returnedVal).toEqual(expectedReturn)
  })

  // TODO: test with time filters

  test('getRecruits (with no recruits) returns expected value', async () => {
    const referringUserId = getMockUserInfo().id
    const getRecruits = require('../getRecruits').getRecruits

    // Mock ReferralDataModel query
    const referralDataLogsToReturn = []
    setMockDBResponse(
      DatabaseOperation.QUERY,
      {
        Items: referralDataLogsToReturn
      }
    )

    // Mock User query
    const recruitedUsersToReturn = []
    const recruitedUsersQueryMock = setMockDBResponse(
      DatabaseOperation.GET_BATCH,
      {
        Responses: {
          [UserModel.tableName]: recruitedUsersToReturn
        }
      }
    )

    const returnedVal = await getRecruits(userContext, referringUserId)
    expect(recruitedUsersQueryMock).not.toHaveBeenCalled()
    expect(returnedVal).toEqual([])
  })

  test('getTotalRecruitsCount works as expected', async () => {
    const getTotalRecruitsCount = require('../getRecruits').getTotalRecruitsCount
    const recruitsEdgesTestA = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          lastActive: '2017-12-19T08:23:40.532Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          lastActive: '2017-02-07T18:00:09.031Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          lastActive: null
        }
      }
    ]
    expect(getTotalRecruitsCount(recruitsEdgesTestA)).toBe(3)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          lastActive: '2017-12-19T08:23:40.532Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          lastActive: '2017-02-09T08:23:40.532Z'
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
          lastActive: '2017-12-19T08:23:40.532Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          lastActive: '2017-02-07T18:00:09.031Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T17:69:46.000Z',
          lastActive: null
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestA)).toBe(1)

    const recruitsEdgesTestB = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          lastActive: '2017-12-19T08:23:40.532Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-02-07T13:59:46.000Z',
          lastActive: '2017-02-09T08:23:40.532Z'
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestB)).toBe(2)

    const recruitsEdgesTestC = []
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestC)).toBe(0)

    expect(getRecruitsActiveForAtLeastOneDay(null)).toBe(0)

    const recruitsEdgesTestD = [
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          lastActive: '2017-05-20T13:59:47.000Z'
        }
      },
      {
        cursor: 'abc',
        node: {
          recruitedAt: '2017-05-19T13:59:46.000Z',
          lastActive: '2017-05-20T13:59:45.499Z'
        }
      }
    ]
    expect(getRecruitsActiveForAtLeastOneDay(recruitsEdgesTestD)).toBe(1)
  })
})
