/* eslint-env jest */
import { SFAC_EXTENSION_PROMPT } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import getSfacActivityState from '../getSfacActivityState'
import Feature from '../../experiments/FeatureModel'
import { SFAC_ACTIVITY_STATES } from '../../constants'

jest.mock('../../users/getSfacActivityState')
jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = {
  ...getMockUserInstance(),
  tabs: 0,
  joined: '2022-09-27T18:37:04.604Z',
}

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

  it('returns false if user is in wrong activity state', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    getSfacActivityState.mockResolvedValueOnce(SFAC_ACTIVITY_STATES.ACTIVE)
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
      tabs: 5,
      joined: '2021-01-29T18:37:04.604Z',
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(false)
  })

  it('returns false if user if not enough tabs', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    getSfacActivityState.mockResolvedValueOnce(SFAC_ACTIVITY_STATES.INACTIVE)
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
      tabs: 3,
      joined: '2021-01-29T18:37:04.604Z',
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(false)
  })

  it('returns false if user joined too recently and is v4Enabled', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    getSfacActivityState.mockResolvedValueOnce(SFAC_ACTIVITY_STATES.INACTIVE)
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
      tabs: 5,
      v4BetaEnabled: true,
      joined: '2022-09-29T18:37:04.604Z',
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(false)
  })

  it('returns true if user joined too recently and is not v4Enabled', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    getSfacActivityState.mockResolvedValueOnce(SFAC_ACTIVITY_STATES.INACTIVE)
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
      tabs: 5,
      v4BetaEnabled: false,
      joined: '2022-09-29T18:37:04.604Z',
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(true)
  })

  it('returns true if all old user criteria fit', async () => {
    expect.assertions(1)
    const getShouldShowSfacExtensionPrompt = require('../getShouldShowSfacExtensionPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: SFAC_EXTENSION_PROMPT,
        variation: 'Control',
      })
    )
    getSfacActivityState.mockResolvedValueOnce(SFAC_ACTIVITY_STATES.INACTIVE)
    const modifiedUser = {
      ...user,
      sfacPrompt: {
        hasRespondedToPrompt: false,
      },
      tabs: 5,
      joined: '2021-09-29T18:37:04.604Z',
    }

    const result = await getShouldShowSfacExtensionPrompt(
      userContext,
      modifiedUser
    )
    expect(result).toEqual(true)
  })
})
