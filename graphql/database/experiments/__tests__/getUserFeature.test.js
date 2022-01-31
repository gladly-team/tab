/* eslint-env jest */
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../FeatureModel'

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserFeatures tests', () => {
  it('gets userFeatures as expected', async () => {
    expect.assertions(1)
    const getUserFeature = require('../getUserFeature').default

    const result = await getUserFeature(userContext, user, 'test-feature')
    expect(result).toEqual(
      new Feature({
        featureName: 'test-feature',
        variation: false,
      })
    )
  })
})
