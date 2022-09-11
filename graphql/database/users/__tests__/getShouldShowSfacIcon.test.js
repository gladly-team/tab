/* eslint-env jest */
import { SFAC_EXTENSION_PROMPT } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('getShouldShowSfacIcon tests', () => {
  it('returns false if the user is in the experiment but it is not dev', async () => {
    process.env.NEXT_PUBLIC_GROWTHBOOK_ENV = 'production'
    expect.assertions(1)
    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Notification',
      })
    )

    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(false)
  })

  it('returns false if the user is in not the experiment but it is dev', async () => {
    process.env.NEXT_PUBLIC_GROWTHBOOK_ENV = 'dev'
    expect.assertions(1)
    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )

    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(false)
  })

  it('returns true if the user is in the experiment and env is dev', async () => {
    process.env.NEXT_PUBLIC_GROWTHBOOK_ENV = 'dev'
    expect.assertions(1)
    const getShouldShowSfacIcon = require('../getShouldShowSfacIcon').default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Notification',
      })
    )
    const result = await getShouldShowSfacIcon(userContext, user)
    expect(result).toEqual(true)
  })
})
