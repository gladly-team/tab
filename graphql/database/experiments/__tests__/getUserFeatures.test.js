/* eslint-env jest */
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../FeatureModel'

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserFeatures tests', () => {
  it('gets userFeatures as expected', async () => {
    expect.assertions(1)
    const getUserFeatures = require('../getUserFeatures').default

    const result = await getUserFeatures(userContext, user)
    expect(result).toEqual([
      new Feature({
        featureName: 'test-feature',
        variation: false,
      }),
      new Feature({
        featureName: 'yahoo-search-existing-users',
        variation: false,
      }),
      new Feature({
        featureName: 'yahoo-search-new-users',
        variation: 'Google',
      }),
    ])
  })
})
