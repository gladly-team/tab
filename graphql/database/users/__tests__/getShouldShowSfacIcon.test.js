/* eslint-env jest */
import { SFAC_EXTENSION_PROMPT } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

beforeEach(() => {
  jest.resetModules()
})

describe('getShouldShowSfacIcon tests', () => {
  it('returns false if the user is in the experiment but it is not dev', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Notification',
      })
    )

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if the user is in not the experiment but it is dev', async () => {
    expect.assertions(1)

    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )

    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(false)
  })
})
