/* eslint-env jest */
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../FeatureModel'
import { showInternalOnly } from '../../../utils/authorization-helpers'
import features from '../features'

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

describe('getUserFeatures tests', () => {
  it('gets userFeatures as expected', async () => {
    expect.assertions(2)
    const createUserExperiment = require('../createUserExperiment').default
    const getUserFeatures = require('../getUserFeatures').default

    const result = await getUserFeatures(userContext, user)
    expect(result).toEqual([
      new Feature({
        featureName: 'test-feature',
        variation: false,
      }),
      new Feature({
        featureName: 'yahoo-search',
        variation: false,
      }),
    ])
    expect(createUserExperiment).not.toHaveBeenCalled()
  })

  it('properly sets growthbook attributes based on user properties', async () => {
    expect.assertions(1)
    const getUserFeatures = require('../getUserFeatures').default

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({ value: true }),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)

    await getUserFeatures(userContext, user)
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
    const getUserFeatures = require('../getUserFeatures').default

    const { GrowthBook } = require('@growthbook/growthbook')
    const mockGrowthbook = {
      feature: jest.fn().mockReturnValue({ value: true }),
      setFeatures: jest.fn(),
      setAttributes: jest.fn(),
    }
    GrowthBook.mockImplementation(() => mockGrowthbook)

    await getUserFeatures(userContext, user)
    expect(mockGrowthbook.setFeatures).toHaveBeenCalledWith(features)
  })

  it('logs to createUserExperiment if assigned because it is an experiment', async () => {
    expect.assertions(2)
    const createUserExperiment = require('../createUserExperiment').default
    const mockFeatures = {
      'test-feature': {
        defaultValue: false,
        rules: [
          {
            condition: {
              isTabTeamMember: true,
              env: 'local',
            },
            force: true,
          },
        ],
      },
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

    const getUserFeatures = require('../getUserFeatures').default
    const result = await getUserFeatures(userContext, user)
    expect(result).toEqual([
      new Feature({
        featureName: 'test-feature',
        variation: false,
      }),
      new Feature({
        featureName: 'yahoo-search',
        variation: 'variation-A',
      }),
    ])
    expect(createUserExperiment).toHaveBeenCalledWith(
      userContext,
      user.id,
      'yahoo-search',
      'variation-A'
    )
  })
})
