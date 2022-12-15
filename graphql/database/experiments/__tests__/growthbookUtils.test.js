/* eslint-env jest */
import moment from 'moment'
import {
  getMockUserContext,
  getMockUserInstance,
  mockDate,
} from '../../test-utils'
import { showInternalOnly } from '../../../utils/authorization-helpers'
import features from '../features'
import Feature from '../FeatureModel'

jest.mock('../../../utils/logger')
jest.mock('../createUserExperiment')
jest.mock('../../../config', () => ({
  GROWTHBOOK_ENV: 'test',
  DB_TABLE_NAME_APPENDIX: '',
}))
jest.mock('../features', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../features').default
    },
  }
  return module
})
jest.mock('@growthbook/growthbook')

beforeEach(() => {
  process.env.GROWTHBOOK_ENV = 'test'
  mockDate.on()
})

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
  mockDate.off()
})

const userContext = getMockUserContext()
const user = getMockUserInstance()

const getMockGrowthBookFeature = () => ({
  value: false,
  on: false,
  off: true,
  source: 'experiment',
  ruleId: '',

  // Experiment properties won't exist for people not included in
  // the experiment.
  experiment: {
    variations: [false, true],
    key: 'test-experiment',
    coverage: 1,
  },
  experimentResult: {
    inExperiment: true,
    variationId: 0,
    value: false,
    hashAttribute: 'id',
    hashValue: 'abc123',
  },
})

describe('growthbookUtils tests', () => {
  it('getConfiguredGrowthbook properly sets growthbook attributes based on user properties', async () => {
    expect.assertions(1)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue(getMockGrowthBookFeature()),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)
    const expectedJoinedTime = new Date(user.joined).getTime()

    await getConfiguredGrowthbook(user)
    expect(mockGrowthbook.setAttributes).toHaveBeenCalledWith({
      id: user.id,
      env: 'test',
      causeId: user.causeId,
      v4BetaEnabled: user.v4BetaEnabled,
      joined: expectedJoinedTime,
      isTabTeamMember: showInternalOnly(user.email),
      internalExperimentOverrides: {},
      tabs: 0,
      timeSinceJoined: moment.utc().valueOf() - expectedJoinedTime,
    })
  })

  test('getConfiguredGrowthbook correctly validates attributes object', async () => {
    expect.assertions(2)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')
    const logger = require('../../../utils/logger').default
    const mockUser = {
      id: 'abcdefghijklmno',
      env: null,
      causeId: 'causeId',
      v4BetaEnabled: undefined,
      joined: undefined,
    }
    await getConfiguredGrowthbook(mockUser)
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook attribute "joined" for userId abcdefghijklmno is undefined'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook attribute "v4BetaEnabled" for userId abcdefghijklmno is undefined'
    )
  })

  test('getConfiguredGrowthbook does not warn on missing user attributes when the attributes are expected', async () => {
    expect.assertions(1)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')
    const logger = require('../../../utils/logger').default
    await getConfiguredGrowthbook({ noUserAttributes: true })
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('properly sets growthbook features based on user properties', async () => {
    expect.assertions(1)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest
        .fn()
        .mockReturnValue({ ...getMockGrowthBookFeature(), value: true }),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)

    await getConfiguredGrowthbook(user)
    expect(mockGrowthbook.setFeatures).toHaveBeenCalledWith(features)
  })

  it('logs to createUserExperiment if assigned because it is an experiment', async () => {
    expect.assertions(2)
    const mockFeatures = {
      'yahoo-search': {
        defaultValue: false,
        rules: [
          {
            variations: ['variation-A', 'variation-B'],
            weights: [1.0, 0.0],
          },
        ],
      },
    }
    const featuresModule = require('../features')
    jest
      .spyOn(featuresModule, 'default', 'get')
      .mockImplementation(() => mockFeatures)

    const growthbookUtils = require('../growthbookUtils')
    const configuredGrowthbook = growthbookUtils.getConfiguredGrowthbook(user)
    const createUserExperiment = require('../createUserExperiment').default
    const { getAndLogFeatureForUser } = growthbookUtils
    const result = await getAndLogFeatureForUser(
      userContext,
      user.id,
      configuredGrowthbook,
      'yahoo-search'
    )
    expect(result).toEqual(
      new Feature({
        featureName: 'yahoo-search',
        variation: 'variation-A',
        inExperiment: true,
      })
    )
    expect(createUserExperiment).toHaveBeenCalledWith(userContext, user.id, {
      experimentId: 'yahoo-search',
      variationId: 0,
      variationValueStr: '"variation-A"',
    })
  })

  it('does not log to createUserExperiment when it is not an experiment', async () => {
    expect.assertions(2)
    const mockFeatures = {
      'test-feature': {
        defaultValue: false,
      },
    }
    const featuresModule = require('../features')
    jest
      .spyOn(featuresModule, 'default', 'get')
      .mockImplementation(() => mockFeatures)

    const growthbookUtils = require('../growthbookUtils')
    const configuredGrowthbook = growthbookUtils.getConfiguredGrowthbook(user)
    const createUserExperiment = require('../createUserExperiment').default
    const { getAndLogFeatureForUser } = growthbookUtils
    const result = await getAndLogFeatureForUser(
      userContext,
      user.id,
      configuredGrowthbook,
      'test-feature'
    )
    expect(result).toEqual(
      new Feature({
        featureName: 'test-feature',
        variation: false,
        inExperiment: false,
      })
    )
    expect(createUserExperiment).not.toHaveBeenCalledWith()
  })

  test('getFeatureWithoutUser throws if the feature returned is an experiment', async () => {
    expect.assertions(1)
    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({
        ...getMockGrowthBookFeature(),
        value: 'abc-123',
        experiment: {
          variations: [false, true],
          key: 'test-experiment',
          coverage: 1,
        },
        experimentResult: {
          inExperiment: true,
        },
      }),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)

    const growthbookUtils = require('../growthbookUtils')
    const configuredGrowthbook = growthbookUtils.getConfiguredGrowthbook(user)
    const { getFeatureWithoutUser } = growthbookUtils
    await expect(
      getFeatureWithoutUser(configuredGrowthbook, 'some-feature')
    ).rejects.toThrow(
      'Running an experiment requires passing user attributes to Growthbook.'
    )
  })

  test('getFeatureWithoutUser returns as expected', async () => {
    expect.assertions(1)
    const mockFeatures = {
      'some-feature': {
        defaultValue: 'def-456',
        rules: [
          {
            force: 'abc-123',
          },
        ],
      },
    }
    const featuresModule = require('../features')
    jest
      .spyOn(featuresModule, 'default', 'get')
      .mockImplementation(() => mockFeatures)
    const growthbookUtils = require('../growthbookUtils')
    const configuredGrowthbook = growthbookUtils.getConfiguredGrowthbook(user)
    const { getFeatureWithoutUser } = growthbookUtils
    const result = await getFeatureWithoutUser(
      configuredGrowthbook,
      'some-feature'
    )
    expect(result).toEqual(
      new Feature({
        featureName: 'some-feature',
        variation: 'abc-123',
        inExperiment: false,
      })
    )
  })
})
