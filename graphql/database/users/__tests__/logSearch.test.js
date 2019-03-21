/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import UserSearchLogModel from '../UserSearchLogModel'
import logSearch from '../logSearch'
import addVc from '../addVc'
import {
  DatabaseOperation,
  addTimestampFieldsToItem,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../addVc')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  mockDate.off()
})

describe('logSearch', () => {
  test('when the user should receive VC, it increments the VC', async () => {
    expect.assertions(2)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // VC should increment.
    expect(addVc).toHaveBeenCalled()

    // It should update searches and maxSearchesDay values.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      searches: { $add: 1 },
      lastSearchTimestamp: moment.utc().toISOString(),
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 149,
        },
      },
    })
  })

  test('it logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId)

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('when the user should not receive VC, it still logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 10213,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 10213, // above daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId)

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test("for the first search logged today, it resets the date for today's search counter", async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 20,
        },
        recentDay: {
          date: moment
            .utc()
            .subtract(5, 'days')
            .toISOString(),
          numSearches: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // maxSearchesDay should set recentDay.date to today.
    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numSearches: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // reset to 1
      },
    })
  })

  test('when this is not the first search today, it increments the search count', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 20,
        },
        recentDay: {
          date: moment.utc().toISOString(), // today
          numSearches: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // maxSearchesDay should set recentDay.date to today.
    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numSearches: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 6, // added 1
      },
    })
  })

  test('when today is also the max search day, update the maxDay date', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 43,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(), // today
        numSearches: 44,
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 44, // added 1
      },
    })
  })

  test('the max searches count increases when exceeding it', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 44,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numSearches: 45, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 45, // added 1
      },
    })
  })

  test('max search day values work appropriately for new users', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // added 1
      },
    })
  })
})
