/* eslint-env jest */
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import { showInternalOnly } from '../../../utils/authorization-helpers'
import features from '../features'
import Feature from '../FeatureModel'

jest.mock('../../../utils/logger')
jest.mock('../createUserExperiment')
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
})

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
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

    await getConfiguredGrowthbook(user)
    expect(mockGrowthbook.setAttributes).toHaveBeenCalledWith({
      id: user.id,
      env: 'test',
      causeId: user.causeId,
      v4BetaEnabled: user.v4BetaEnabled,
      joined: user.joined,
      isTabTeamMember: showInternalOnly(user.email),
    })
  })

  it('getConfiguredGrowthbook correctly validates attributes object', async () => {
    expect.assertions(3)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')
    const logger = require('../../../utils/logger').default
    const mockUser = {
      id: 'abcdefghijklmno',
      env: null,
      causeId: 'causeId',
      v4BetaEnabled: true,
      joined: undefined,
      isTabTeamMember: null,
    }

    await getConfiguredGrowthbook(mockUser)

    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute env for userId abcdefghijklmno was null'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute joined for userId abcdefghijklmno was undefined'
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Growthbook Attribute isTabTeamMember for userId abcdefghijklmno was null'
    )
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
      })
    )
    expect(createUserExperiment).not.toHaveBeenCalledWith()
  })
})
