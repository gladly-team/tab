/* eslint-env jest */
import Feature from '../FeatureModel'
import {
  getConfiguredGrowthbook,
  getFeatureWithoutUser,
} from '../growthbookUtils'

jest.mock('../growthbookUtils')

describe('getFeature', () => {
  it('configures Growthbook expected', async () => {
    expect.assertions(1)
    getFeatureWithoutUser.mockReturnValueOnce({
      featureName: 'test-feature',
      variation: 'foo',
      inExperiment: false,
    })
    const getFeature = require('../getFeature').default
    await getFeature('test-feature')
    expect(getConfiguredGrowthbook).toHaveBeenCalledWith({
      noUserAttributes: true,
    })
  })

  it('gets feature as expected', async () => {
    expect.assertions(1)
    getFeatureWithoutUser.mockReturnValueOnce({
      featureName: 'test-feature',
      variation: 'foo',
      inExperiment: false,
    })
    const getFeature = require('../getFeature').default
    const result = await getFeature('test-feature')
    expect(result).toEqual(
      new Feature({
        featureName: 'test-feature',
        variation: 'foo',
        inExperiment: false,
      })
    )
  })
})
