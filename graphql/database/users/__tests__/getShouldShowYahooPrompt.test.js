/* eslint-env jest */
import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
} from '../../experiments/experimentConstants'
import { getMockUserInstance, getMockUserContext } from '../../test-utils'
import getUserFeature from '../../experiments/getUserFeature'
import Feature from '../../experiments/FeatureModel'

jest.mock('../../experiments/getUserFeature')

const userContext = getMockUserContext()
const user = getMockUserInstance()

describe('shouldShowYahooPrompt tests', () => {
  it('[existing user exp] returns false if the user is in the experiment but has already responded to the prompt', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: true,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }

    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(false)
  })

  it('[existing user exp] returns true if user has a yahooSearchSwitchPrompt property but hasRespondedToPrompt is false', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(true)
  })

  it('[existing user exp] returns true if the user is in the treatment group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(true)
  })

  it('[new user exp] returns true if the user is in the treatment group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
          variation: 'SearchForACause', // in experiment grorup
        })
      )
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(true)
  })

  it('[new user exp v2] returns false if the user is not the treatment group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: true,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(false)
  })

  it('[new user exp v2] returns true if the user is in the treatment group of the experiment', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Notification',
          inExperiment: true,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(true)
  })

  it('[new experiment v2] returns false if the user is in the control groups of all experiments', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: true,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(false)
  })

  it('returns false if the user is in the control groups of both experiments', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const modifiedUser = {
      ...user,
      yahooSearchSwitchPrompt: {
        hasRespondedToPrompt: false,
        timestamp: '2022-04-27T15:19:27.076Z',
      },
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, modifiedUser)
    expect(result).toEqual(false)
  })

  it('returns false if the user has already opted in for search', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const optedInUser = {
      ...user,
      yahooSearchSwitchPrompt: undefined,
      yahooPaidSearchRewardOptIn: true,
      searchEngine: 'Google',
    }
    const result = await getShouldShowYahooPrompt(userContext, optedInUser)
    expect(result).toEqual(false)
  })

  it('still returns true if the user is already using the charitable search engine', async () => {
    expect.assertions(1)
    const getShouldShowYahooPrompt =
      require('../getShouldShowYahooPrompt').default
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
      .mockResolvedValueOnce(
        new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Control',
          inExperiment: false,
        })
      )
    const optedInUser = {
      ...user,
      yahooSearchSwitchPrompt: undefined,
      yahooPaidSearchRewardOptIn: false,
      searchEngine: 'SearchForACause',
    }
    const result = await getShouldShowYahooPrompt(userContext, optedInUser)
    expect(result).toEqual(true)
  })
})
