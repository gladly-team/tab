/* eslint-env jest */
import { SFAC_EXTENSION_PROMPT } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('shouldShowSfacExtensionPrompt tests', () => {
  it('returns false if the user is in the experiment but has already responded to the prompt', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Notification',
      })
    )
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: true,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(false)
  })

  it('returns true if the user is in the experiment and has not responded', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Notification',
      })
    )
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(true)
  })

  it('returns false if the user is not in the experiment', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(false)
  })
})
