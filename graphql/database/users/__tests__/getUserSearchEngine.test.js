/* eslint-env jest */

import getUserSearchEngine from '../getUserSearchEngine'
import {
  getMockUserContext,
  mockDate,
  getMockUserInstance,
} from '../../test-utils'
import getWidgets from '../../widgets/getWidgets'
import BaseWidgetModel from '../../widgets/baseWidget/BaseWidgetModel'
import UserWidgetModel from '../../widgets/userWidget/UserWidgetModel'
import constructFullWidget from '../../widgets/constructFullWidget'
import Feature from '../../experiments/FeatureModel'
import {
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
} from '../../experiments/experimentConstants'
import getSearchEngine from '../../search/getSearchEngine'
import { WIDGET_TYPE_SEARCH } from '../../constants'
import ReferralDataModel from '../../referrals/ReferralDataModel'
import logger from '../../../utils/logger'
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'

jest.mock('../../experiments/getUserFeature')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../../cause/getCause')
jest.mock('../../widgets/getWidgets')
jest.mock('../../referrals/ReferralDataModel')
jest.mock('../../../utils/logger')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(ReferralDataModel, 'get').mockResolvedValue({
    userId: 'abc123',
    referringUser: null,
    referringChannel: null,
  })
})
const user = getMockUserInstance()

describe('getUserSearchEngine', () => {
  it('defaults user engine to user feature value v2 if no widget, or not set on model', async () => {
    expect.assertions(1)
    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((context, usr, featureName) => {
      if (featureName === YAHOO_SEARCH_NEW_USERS_V2) {
        return new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Tooltip',
          inExperiment: true,
        })
      }
      return new Feature({
        featureName: YAHOO_SEARCH_NEW_USERS,
        variation: 'DuckDuckGo',
      })
    })
    getWidgets.mockResolvedValueOnce([])

    const result = await getUserSearchEngine(userContext, user)
    const expectedResult = {
      ...(await getSearchEngine('SearchForACause')),
      searchUrlPersonalized:
        'https://tab.gladly.io/search/v2?q={searchTerms}&src=tab',
    }
    expect(result).toEqual(expectedResult)
  })

  it('defaults user engine to user feature value if no widget, or not set on model', async () => {
    expect.assertions(1)
    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockImplementation((context, usr, featureName) => {
      if (featureName === YAHOO_SEARCH_NEW_USERS_V2) {
        return new Feature({
          featureName: YAHOO_SEARCH_NEW_USERS_V2,
          variation: 'Tooltip',
          inExperiment: true,
        })
      }
      return new Feature({
        featureName: YAHOO_SEARCH_NEW_USERS,
        variation: 'DuckDuckGo',
      })
    })
    getWidgets.mockResolvedValueOnce([])

    const result = await getUserSearchEngine(userContext, user)
    const expectedResult = {
      ...(await getSearchEngine('SearchForACause')),
      searchUrlPersonalized:
        'https://tab.gladly.io/search/v2?q={searchTerms}&src=tab',
    }
    expect(result).toEqual(expectedResult)
  })

  it('returns the search engine on the user model', async () => {
    expect.assertions(1)
    const searchEngine = 'DuckDuckGo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result).toEqual(await getSearchEngine(searchEngine))
  })

  it('gets the engine from the search widget if search widget malformed', async () => {
    expect.assertions(1)
    const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd40'
    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: user.userId,
        widgetId,
        config: {
          engine: 'test-engine',
        },
      }),
    ]
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: widgetId,
        position: 2,
        type: WIDGET_TYPE_SEARCH,
      }),
    ]
    const sortedFullWidgets = [
      constructFullWidget(userWidgetsToGet[0], baseWidgetsToGet[0]),
    ]
    getWidgets.mockResolvedValueOnce(sortedFullWidgets)

    const result = await getUserSearchEngine(userContext, user)
    const expectedResult = {
      ...(await getSearchEngine('SearchForACause')),
      searchUrlPersonalized:
        'https://tab.gladly.io/search/v2?q={searchTerms}&src=tab',
    }
    expect(result).toEqual(expectedResult)
  })

  it('gets the engine from the search widget if search widget', async () => {
    expect.assertions(1)
    const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd40'
    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: user.userId,
        widgetId,
        config: {
          engine: 'DuckDuckGo',
        },
      }),
    ]
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: widgetId,
        position: 2,
        type: WIDGET_TYPE_SEARCH,
      }),
    ]
    const sortedFullWidgets = [
      constructFullWidget(userWidgetsToGet[0], baseWidgetsToGet[0]),
    ]
    getWidgets.mockResolvedValueOnce(sortedFullWidgets)

    const result = await getUserSearchEngine(userContext, user)
    expect(result).toEqual(await getSearchEngine('DuckDuckGo'))
  })

  it('SFAC engine: returns the expected *unpersonalized* search URL', async () => {
    expect.assertions(1)
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrl).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}'
    )
  })

  it('SFAC engine: returns the expected search URL', async () => {
    expect.assertions(1)
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrlPersonalized).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}&src=tab'
    )
  })

  it('SFAC engine (personalized): adds a "src" URL parameter', async () => {
    expect.assertions(1)
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('src')).toEqual('tab')
  })

  it('SFAC engine (personalized): adds a "c" URL parameter when the user is supporting a cause', async () => {
    expect.assertions(1)
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: true,
      causeId: 'abc123',
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('c')).toEqual('abc123')
  })

  it('SFAC engine (personalized): does not add a "c" URL parameter when the user is not using v4', async () => {
    expect.assertions(1)
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: false,
      causeId: 'abc123',
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('c')).toBeNull()
  })

  it('SFAC engine (personalized): adds a "r" URL parameter when the user has a referring ID', async () => {
    expect.assertions(1)
    jest.spyOn(ReferralDataModel, 'get').mockResolvedValueOnce({
      userId: 'abc123',
      referringUser: null,
      referringChannel: '998877',
    })
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('r')).toEqual('998877')
  })

  it('SFAC engine (personalized): still returns a search URL if adding reporting parameters fails', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralDataModel, 'get')
      .mockRejectedValueOnce(new Error('Uh oh!'))
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrlPersonalized).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}'
    )
  })

  it('SFAC engine (personalized): logs an error if adding reporting parameters fails (', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralDataModel, 'get')
      .mockRejectedValueOnce(new Error('Uh oh!'))
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    await getUserSearchEngine(userContext, mockUser)
    expect(logger.error).toHaveBeenCalledWith(new Error('Uh oh!'))
  })

  it('SFAC engine (personalized): does not log an error if the ReferralDataModel item does not exist', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralDataModel, 'get')
      .mockRejectedValueOnce(new DatabaseItemDoesNotExistException())
    const searchEngine = 'SearchForACause'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    await getUserSearchEngine(userContext, mockUser)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('Yahoo engine: returns the expected search URL (unpersonalized)', async () => {
    expect.assertions(1)
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrl).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}'
    )
  })

  it('Yahoo engine (personalized): returns the expected search URL', async () => {
    expect.assertions(1)
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrlPersonalized).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}&src=tab'
    )
  })

  it('Yahoo engine (personalized): adds a "src" URL parameter', async () => {
    expect.assertions(1)
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('src')).toEqual('tab')
  })

  it('Yahoo engine (personalized): adds a "c" URL parameter when the user is supporting a cause', async () => {
    expect.assertions(1)
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: true,
      causeId: 'abc123',
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('c')).toEqual('abc123')
  })

  it('Yahoo engine (personalized): does not add a "c" URL parameter when the user is not using v4', async () => {
    expect.assertions(1)
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: false,
      causeId: 'abc123',
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('c')).toBeNull()
  })

  it('Yahoo engine (personalized): adds a "r" URL parameter when the user has a referring ID', async () => {
    expect.assertions(1)
    jest.spyOn(ReferralDataModel, 'get').mockResolvedValueOnce({
      userId: 'abc123',
      referringUser: null,
      referringChannel: '998877',
    })
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('r')).toEqual('998877')
  })

  it('Yahoo engine (personalized): still returns a search URL if adding reporting parameters fails', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralDataModel, 'get')
      .mockRejectedValueOnce(new Error('Uh oh!'))
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrlPersonalized).toEqual(
      'https://tab.gladly.io/search/v2?q={searchTerms}'
    )
  })

  it('Yahoo engine (personalized): logs an error if adding reporting parameters fails', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralDataModel, 'get')
      .mockRejectedValueOnce(new Error('Uh oh!'))
    const searchEngine = 'Yahoo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    await getUserSearchEngine(userContext, mockUser)
    expect(logger.error).toHaveBeenCalledWith(new Error('Uh oh!'))
  })

  it('Google: returns the expected search URL', async () => {
    expect.assertions(1)
    const searchEngine = 'Google'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: true,
      causeId: 'abc123',
    }
    jest.spyOn(ReferralDataModel, 'get').mockResolvedValueOnce({
      userId: 'abc123',
      referringUser: null,
      referringChannel: '998877',
    })
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result.searchUrl).toEqual(
      'https://www.google.com/search?q={searchTerms}'
    )
  })

  it('Google engine (personalized): does not add "src", "c", or "r" URL parameter values', async () => {
    expect.assertions(3)
    const searchEngine = 'Google'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
      v4BetaEnabled: true,
      causeId: 'abc123',
    }
    jest.spyOn(ReferralDataModel, 'get').mockResolvedValueOnce({
      userId: 'abc123',
      referringUser: null,
      referringChannel: '998877',
    })
    const result = await getUserSearchEngine(userContext, mockUser)
    const url = new URL(result.searchUrlPersonalized)
    expect(url.searchParams.get('src')).toBeNull()
    expect(url.searchParams.get('c')).toBeNull()
    expect(url.searchParams.get('r')).toBeNull()
  })
})
