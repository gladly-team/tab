/* eslint-env jest */
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import { showInternalOnly } from '../../../utils/authorization-helpers'
import features from '../features'
import Feature from '../FeatureModel'

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

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('growthbookUtils tests', () => {
  it('getConfiguredGrowthbook properly sets growthbook attributes based on user properties', async () => {
    expect.assertions(1)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({ value: true }),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)

    await getConfiguredGrowthbook(user)
    expect(mockGrowthbook.setAttributes).toHaveBeenCalledWith({
      id: user.id,
      env: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV,
      causeId: user.causeId,
      v4BetaEnabled: user.v4BetaEnabled,
      joined: user.joined,
      isTabTeamMember: showInternalOnly(user.email),
    })
  })

  it('properly sets growthbook features based on user properties', async () => {
    expect.assertions(1)
    const { getConfiguredGrowthbook } = require('../growthbookUtils')

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({ value: true }),
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
    expect(createUserExperiment).toHaveBeenCalledWith(
      userContext,
      user.id,
      'yahoo-search',
      'variation-A'
    )
  })

  it('does not log to createUserExperiment if assigned because it is an experiment', async () => {
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
