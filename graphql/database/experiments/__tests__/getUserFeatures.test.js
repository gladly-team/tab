// TODO: remove eslint-disable
/* eslint-disable */
/* eslint-env jest */
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../FeatureModel'

jest.mock('../features', () => ({
  'test-feature': {
    defaultValue: false,
    rules: [],
  },
  'some-other-feature': {
    defaultValue: 'foo',
    rules: [],
  },
}))
jest.mock('../growthbookUtils')

const userContext = getMockUserContext()
const user = getMockUserInstance()

beforeEach(() => {
  jest.resetModules()
  const { getAndLogFeatureForUser } = require('../growthbookUtils')
  getAndLogFeatureForUser
    .mockReturnValueOnce(
      new Feature({
        featureName: 'test-feature',
        variation: false,
      })
    )
    .mockReturnValueOnce(
      new Feature({
        featureName: 'some-other-feature',
        variation: 'foo',
      })
    )
})

describe('getUserFeatures tests', () => {
  it('gets userFeatures as expected', async () => {
    expect.assertions(1)
    const getUserFeatures = require('../getUserFeatures').default
    const result = await getUserFeatures(userContext, user)

    // FIXME
    expect(result).toEqual([])
    // expect(result).toEqual([
    //   new Feature({
    //     featureName: 'test-feature',
    //     variation: false,
    //   }),
    //   new Feature({
    //     featureName: 'some-other-feature',
    //     variation: 'foo',
    //   }),
    // ])
  })
})
