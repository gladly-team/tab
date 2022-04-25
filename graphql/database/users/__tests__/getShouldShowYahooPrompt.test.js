/* eslint-env jest */
import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('shouldShowYahooPrompt tests', () => {
  it('returns false if user has seen yahoo prompt but is in experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_EXISTING_USERS,
          variation: true,
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS,
          variation: 'Google',
        })
      )
    const seenPromptUser = {
      ...user,
      yahooSwitchSearchPrompt: true,
      yahooPaidSearchRewardOptIn: false,
    }

    const result = await getShouldShowYahooPrompt(userContext, seenPromptUser)
    expect(result).toEqual(false)
  })

  it('returns false if user has seen yahoo prompt', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_EXISTING_USERS,
          variation: false,
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS,
          variation: 'SearchForACause',
        })
      )
    const seenPromptUser = {
      ...user,
      yahooSwitchSearchPrompt: true,
      yahooPaidSearchRewardOptIn: false,
    }

    const result = await getShouldShowYahooPrompt(userContext, seenPromptUser)
    expect(result).toEqual(false)
  })

  it('returns true if users feature is true for existing user test', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_EXISTING_USERS,
          variation: true,
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS,
          variation: 'Google',
        })
      )

    const result = await getShouldShowYahooPrompt(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns true if users feature is true for new user test', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_EXISTING_USERS,
          variation: false,
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS,
          variation: 'SearchForACause',
        })
      )

    const result = await getShouldShowYahooPrompt(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if users feature is false for test', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt = require('../getShouldShowYahooPrompt')
      .default
    getUserFeature
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_EXISTING_USERS,
          variation: false,
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS,
          variation: 'Google',
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
      yahooSwitchSearchPrompt: false,
      yahooPaidSearchRewardOptIn: true,
    }

    const result = await getShouldShowYahooPrompt(userContext, optedInUser)
    expect(result).toEqual(false)
  })
})
