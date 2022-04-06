/* eslint-env jest */
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../FeatureModel'
import { getAndLogFeatureForUser } from '../growthbookUtils'

jest.mock('../growthbookUtils')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getUserFeature tests', () => {
  it('gets userFeature as expected', async () => {
    expect.assertions(1)
    getAndLogFeatureForUser.mockReturnValueOnce({
      featureName: 'test-feature',
      variation: false,
    })
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
