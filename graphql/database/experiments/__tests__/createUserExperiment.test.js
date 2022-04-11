/* eslint-env jest */
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
  MockAWSConditionalCheckFailedError,
} from '../../test-utils'
import { UnauthorizedQueryException } from '../../../utils/exceptions'
import logger from '../../../utils/logger'
import UserExperimentModel from '../UserExperimentModel'

jest.mock('../../../utils/logger')
jest.mock('../../databaseClient')
beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})
const userContext = getMockUserContext()
const user = getMockUserInfo()

describe('createUserExperiment tests', () => {
  it('creates a new log', async () => {
    expect.assertions(1)
    const createUserExperiment = require('../createUserExperiment').default
    // Mock creation query
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: {},
    })
    const userExperimentDBCall = jest.spyOn(UserExperimentModel, 'getOrCreate')
    await createUserExperiment(userContext, user.id, {
      experimentId: 'test-experiment',
      variationId: 1,
      variationValueStr: 'green',
    })
    expect(userExperimentDBCall).toHaveBeenCalledWith(userContext, {
      created: '2017-05-19T13:59:46.000Z',
      updated: '2017-05-19T13:59:46.000Z',
      experimentId: 'test-experiment',
      timestampAssigned: '2017-05-19T13:59:46.000Z',
      userId: 'abcdefghijklmno',
      variationId: 1,
      variationValueStr: 'green',
    })
  })

  it('returns a success value when a log is created', async () => {
    expect.assertions(1)
    const createUserExperiment = require('../createUserExperiment').default
    // Mock creation query
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: {},
    })

    const result = await createUserExperiment(userContext, user.id, {
      experimentId: 'test-experiment',
      variationId: 1,
      variationValueStr: 'green',
    })
    expect(result).toEqual({ success: true })
  })

  it('logs if finds previously existing entity with different value', async () => {
    expect.assertions(2)
    const createUserExperiment = require('../createUserExperiment').default

    // Mock creation query
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    setMockDBResponse(DatabaseOperation.GET, {
      Item: new UserExperimentModel({
        userId: 'abcdefghijklmno',
        timestampAssigned: '2017-07-18T20:45:53Z',
        experimentId: 'test-experiment',
        variationId: 2,
        variationValueStr: 'green',
      }),
    })

    const result = await createUserExperiment(userContext, user.id, {
      experimentId: 'test-experiment',
      variationId: 4,
      variationValueStr: 'green',
    })
    expect(logger.warn).toHaveBeenCalledWith(
      `Expected to see same variationId 2 for userId ${
        user.id
      } and experimentId test-experiment, instead received variation 4`
    )
    expect(result).toEqual({ success: true })
  })

  it('throws if user id does not match user context', async () => {
    expect.assertions(1)
    const createUserExperiment = require('../createUserExperiment').default
    await expect(createUserExperiment(userContext, 'wrongid')).rejects.toThrow(
      new UnauthorizedQueryException()
    )
  })
})
