/* eslint-env jest */

import moment from 'moment'
import updateWidgetEnabled from '../updateWidgetEnabled'
import UserWidgetModel from '../UserWidgetModel'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  setMockDBResponse
} from '../../../test-utils'

jest.mock('../../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('updateWidgetEnabled', () => {
  it('works as expected', async () => {
    const userInfo = getMockUserInfo()
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: true
    })
    const expectedWidget = Object.assign({}, userWidget, {
      enabled: false,
      updated: moment.utc().toISOString()
    })
    setMockDBResponse(
      DatabaseOperation.UPDATE,
      {
        Attributes: expectedWidget
      }
    )

    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')
    const updatedWidget = await updateWidgetEnabled(userContext, userInfo.id,
      userWidget.widgetId, false)
    expect(userWidgetUpdateMethod)
      .toHaveBeenCalledWith(userContext, {
        userId: userInfo.id,
        widgetId: userWidget.widgetId,
        updated: moment.utc().toISOString(),
        enabled: false
      })
    expect(updatedWidget).toEqual(expectedWidget)
  })
})
