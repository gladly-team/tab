/* eslint-env jest */

import getUserSearchEngine from '../getUserSearchEngine'
import {
  getMockUserContext,
  mockDate,
  getMockUserInstance,
} from '../../test-utils'
import { DEFAULT_SEARCH_ENGINE } from '../../constants'
import getWidgets from '../../widgets/getWidgets'
import { WIDGET_TYPE_SEARCH } from '../../../../web/src/js/constants'
import BaseWidgetModel from '../../widgets/baseWidget/BaseWidgetModel'
import UserWidgetModel from '../../widgets/userWidget/UserWidgetModel'
import constructFullWidget from '../../widgets/constructFullWidget'
import Feature from '../../experiments/FeatureModel'
import { YAHOO_SEARCH_NEW_USERS } from '../../experiments/experimentConstants'

jest.mock('../../experiments/getUserFeature')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
jest.mock('../../cause/getCause')
jest.mock('../../widgets/getWidgets')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})
const user = getMockUserInstance()

describe('getUserSearchEngine', () => {
  it('defaults user engine to google if no widget, not in test or not set on model', async () => {
    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockResolvedValue(undefined)
    getWidgets.mockResolvedValueOnce([])

    const result = await getUserSearchEngine(userContext, user)
    expect(result).toEqual('Google')
  })

  it('defaults user engine to user feature value if no widget, or not set on model', async () => {
    const getUserFeature = require('../../experiments/getUserFeature').default
    getUserFeature.mockResolvedValue(
      new Feature({
        featureName: YAHOO_SEARCH_NEW_USERS,
        variation: 'Google',
      })
    )
    getWidgets.mockResolvedValueOnce([])

    const result = await getUserSearchEngine(userContext, user)
    expect(result).toEqual(DEFAULT_SEARCH_ENGINE)
  })

  it('returns the search engine on the user model', async () => {
    const searchEngine = 'DuckDuckGo'
    const mockUser = {
      ...getMockUserInstance(),
      searchEngine,
    }
    const result = await getUserSearchEngine(userContext, mockUser)
    expect(result).toEqual(searchEngine)
  })

  it('gets the engine from the search widget if set', async () => {
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
    expect(result).toEqual('test-engine')
  })
})
