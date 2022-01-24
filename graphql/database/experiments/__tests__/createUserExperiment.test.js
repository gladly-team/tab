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
const experimentId = 'test-experiment'
const variationId = 'test-variation'
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

    const result = await createUserExperiment(
      userContext,
      user.id,
      'test-experiment',
      'test-variation'
    )
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
        experimentId,
        variationId,
      }),
    })

    const result = await createUserExperiment(
      userContext,
      user.id,
      'test-experiment',
      'test-different-variation'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      `Expected to see same variationId ${variationId} for userId ${
        user.id
      } and experimentId ${experimentId}, instead received variation test-different-variation`
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
