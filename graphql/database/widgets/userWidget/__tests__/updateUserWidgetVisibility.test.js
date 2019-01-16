/* eslint-env jest */

import moment from 'moment'
import updateUserWidgetVisibility from '../updateUserWidgetVisibility'
import UserWidgetModel from '../UserWidgetModel'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  setMockDBResponse,
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

describe('updateUserWidgetVisibility', () => {
  it('works as expected', async () => {
    const userInfo = getMockUserInfo()
    const userWidget = new UserWidgetModel({
      userId: userInfo.id,
      widgetId: 'ab5082cc-151a-4a9a-9289-06906670fd4e',
      enabled: true,
      visible: true,
    })
    const expectedWidget = Object.assign({}, userWidget, {
      visible: false,
      updated: moment.utc().toISOString(),
    })
    setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedWidget,
    })

    const userWidgetUpdateMethod = jest.spyOn(UserWidgetModel, 'update')
    const updatedWidget = await updateUserWidgetVisibility(
      userContext,
      userInfo.id,
      userWidget.widgetId,
      false
    )
    expect(userWidgetUpdateMethod).toHaveBeenCalledWith(userContext, {
      userId: userInfo.id,
      widgetId: userWidget.widgetId,
      updated: moment.utc().toISOString(),
      visible: false,
    })
    expect(updatedWidget).toEqual(expectedWidget)
  })
})
