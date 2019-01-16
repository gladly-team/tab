/* eslint-env jest */

import getUserWidgetsByEnabledState from '../getUserWidgetsByEnabledState'
import UserWidgetModel from '../UserWidgetModel'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInfo,
  setMockDBResponse,
} from '../../../test-utils'

jest.mock('../../../databaseClient')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getUserWidgetsByEnabledState', () => {
  it('gets only enabled widgets', async () => {
    const userInfo = getMockUserInfo()

    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'abc',
        enabled: true,
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'def',
        enabled: false,
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'ghi',
        enabled: true,
      }),
    ]
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: userWidgetsToGet,
    })
    const userWidgetQueryMethod = jest.spyOn(UserWidgetModel, 'query')
    const userWidgets = await getUserWidgetsByEnabledState(
      userContext,
      userInfo.id,
      true
    )
    expect(userWidgetQueryMethod).toHaveBeenCalledWith(userContext, userInfo.id)

    // Should exclude the widgets that aren't enabled.
    expect(userWidgets).toEqual([userWidgetsToGet[0], userWidgetsToGet[2]])
  })

  it('gets only non-enabled widgets', async () => {
    const userInfo = getMockUserInfo()

    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'abc',
        enabled: true,
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'def',
        enabled: false,
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'ghi',
        enabled: true,
      }),
    ]
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: userWidgetsToGet,
    })
    const userWidgetQueryMethod = jest.spyOn(UserWidgetModel, 'query')
    const userWidgets = await getUserWidgetsByEnabledState(
      userContext,
      userInfo.id,
      false
    )
    expect(userWidgetQueryMethod).toHaveBeenCalledWith(userContext, userInfo.id)

    // Should exclude enabled widgets.
    expect(userWidgets).toEqual([userWidgetsToGet[1]])
  })
})
