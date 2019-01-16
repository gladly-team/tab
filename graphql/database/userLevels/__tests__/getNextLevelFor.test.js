/* eslint-env jest */

import UserLevelModel from '../UserLevelModel'
import getNextLevelFor from '../getNextLevelFor'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../users/addVc')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getNextLevelFor', () => {
  it('calls to get a batch of levels as expected', async () => {
    const level = 3
    const vcAllTime = 40
    const userLevelGetBatch = jest
      .spyOn(UserLevelModel, 'getBatch')
      .mockImplementationOnce(() => [
        new UserLevelModel({ id: 4, hearts: 50 }),
        new UserLevelModel({ id: 5, hearts: 60 }),
        new UserLevelModel({ id: 6, hearts: 70 }),
        new UserLevelModel({ id: 7, hearts: 80 }),
        new UserLevelModel({ id: 8, hearts: 90 }),
      ])
    await getNextLevelFor(userContext, level, vcAllTime)
    expect(userLevelGetBatch).toHaveBeenCalledWith(userContext, [
      { id: level + 1 },
      { id: level + 2 },
      { id: level + 3 },
      { id: level + 4 },
      { id: level + 5 },
    ])
  })

  it('returns the correct level even if items are not sorted', async () => {
    const level = 3
    const vcAllTime = 40
    jest
      .spyOn(UserLevelModel, 'getBatch')
      .mockImplementationOnce(() => [
        new UserLevelModel({ id: 8, hearts: 90 }),
        new UserLevelModel({ id: 5, hearts: 60 }),
        new UserLevelModel({ id: 6, hearts: 70 }),
        new UserLevelModel({ id: 7, hearts: 80 }),
        new UserLevelModel({ id: 4, hearts: 50 }),
      ])
    const nextLevel = await getNextLevelFor(userContext, level, vcAllTime)
    expect(nextLevel).toEqual(new UserLevelModel({ id: 4, hearts: 50 }))
  })

  it('returns null if we ran out of levels', async () => {
    const level = 3
    const vcAllTime = 95
    jest.spyOn(UserLevelModel, 'getBatch').mockImplementationOnce(() => [])
    const nextLevel = await getNextLevelFor(userContext, level, vcAllTime)
    expect(nextLevel).toBeNull()
  })

  it('recurses if it needs more levels', async () => {
    const level = 3
    const vcAllTime = 105
    const userLevelGetBatch = jest
      .spyOn(UserLevelModel, 'getBatch')
      .mockImplementationOnce(() => [
        new UserLevelModel({ id: 8, hearts: 90 }),
        new UserLevelModel({ id: 5, hearts: 60 }),
        new UserLevelModel({ id: 6, hearts: 70 }),
        new UserLevelModel({ id: 7, hearts: 80 }),
        new UserLevelModel({ id: 4, hearts: 50 }),
      ])
      .mockImplementationOnce(() => [
        new UserLevelModel({ id: 9, hearts: 100 }),
        new UserLevelModel({ id: 10, hearts: 110 }),
        new UserLevelModel({ id: 11, hearts: 120 }),
        new UserLevelModel({ id: 12, hearts: 130 }),
        new UserLevelModel({ id: 13, hearts: 140 }),
      ])
    const nextLevel = await getNextLevelFor(userContext, level, vcAllTime)
    expect(nextLevel).toEqual(new UserLevelModel({ id: 10, hearts: 110 }))
    expect(userLevelGetBatch).toHaveBeenCalledTimes(2)
  })

  it('calls the database as expected', async () => {
    const level = 3
    const vcAllTime = 40
    const returnedLevels = [
      new UserLevelModel({ id: 8, hearts: 90 }),
      new UserLevelModel({ id: 5, hearts: 60 }),
      new UserLevelModel({ id: 6, hearts: 70 }),
      new UserLevelModel({ id: 7, hearts: 80 }),
      new UserLevelModel({ id: 4, hearts: 50 }),
    ]
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserLevelModel.tableName]: returnedLevels,
      },
    })

    const returnedUser = await getNextLevelFor(userContext, level, vcAllTime)
    const expectedDBParams = dbQueryMock.mock.calls[0][0]
    expect(expectedDBParams).toEqual({
      RequestItems: {
        [UserLevelModel.tableName]: {
          Keys: [{ id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }],
        },
      },
    })
    expect(returnedUser).toEqual(new UserLevelModel({ id: 4, hearts: 50 }))
  })
})
