/* eslint-env jest */
import { YAHOO_SEARCH_EXISTING_USERS } from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('shouldShowYahooPrompt tests', () => {
  it('returns false if the user is in the experiment but has already responded to the prompt', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: false,
      })
    )
    const seenPromptUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: true,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
    }

    const result = await getShouldShowYahooPrompt(userContext, seenPromptUser)
    expect(result).toEqual(false)
  })

  it('returns true if user has a yahooSearchSwitchPrompt property but hasRespondedToPrompt is false', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: true,
      })
    )
    const seenPromptUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
    }
    const result = await getShouldShowYahooPrompt(userContext, seenPromptUser)
    expect(result).toEqual(true)
  })

  it('returns true if the user is in the treatment group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: true,
      })
    )
    const result = await getShouldShowYahooPrompt(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if the user is in the control group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: false,
      })
    )
    const result = await getShouldShowYahooPrompt(userContext, user)
    expect(result).toEqual(false)
  })

  it('returns false if users is already opted in for search', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature.mockResolvedValueOnce(
      new Feature({
        featureName: YAHOO_SEARCH_EXISTING_USERS,
        variation: true,
      })
    )

    const optedInUser = {
      ...user,
      yahooSearchSwitchPrompt: undefined,
      yahooPaidSearchRewardOptIn: true,
    }

    const result = await getShouldShowYahooPrompt(userContext, optedInUser)
    expect(result).toEqual(false)
  })
})
