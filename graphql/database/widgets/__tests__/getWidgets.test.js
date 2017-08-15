/* eslint-env jest */

import getWidgets from '../getWidgets'
import constructFullWidget from '../constructFullWidget'
import getUserWidgetsByEnabledState from '../userWidget/getUserWidgetsByEnabledState'
import BaseWidgetModel from '../baseWidget/BaseWidgetModel'
import UserWidgetModel from '../userWidget/UserWidgetModel'
import {
  getMockUserContext,
  getMockUserInfo
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../userWidget/getUserWidgetsByEnabledState')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getWidgets', () => {
  it('gets all widgets', async () => {
    const userInfo = getMockUserInfo()

    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'abc'
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'def'
      })
    ]
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: 'abc',
        position: 2
      }),
      new BaseWidgetModel({
        id: 'def',
        position: 1
      })
    ]

    const userWidgetQueryMethod = jest.spyOn(UserWidgetModel, 'query')
    jest.spyOn(UserWidgetModel, '_execAsync')
      .mockImplementation(() => {
        return userWidgetsToGet
      })
    const baseWidgetGetBatchMethod = jest.spyOn(BaseWidgetModel, 'getBatch')
      .mockImplementation(() => {
        return baseWidgetsToGet
      })

    const userWidgets = await getWidgets(userContext, userInfo.id)
    expect(userWidgetQueryMethod).toHaveBeenCalledWith(userContext, userInfo.id)
    expect(baseWidgetGetBatchMethod).toHaveBeenCalledWith(userContext, [
      { id: 'abc' }, { id: 'def' }])
    const sortedFullWidgets = [
      constructFullWidget(userWidgetsToGet[1], baseWidgetsToGet[1]),
      constructFullWidget(userWidgetsToGet[0], baseWidgetsToGet[0])
    ]
    expect(userWidgets).toEqual(sortedFullWidgets)
  })

  it('gets enabled widgets when the `enabled` argument is truthy', async () => {
    const userInfo = getMockUserInfo()

    // Set mock query responses.
    const userWidgetsToGet = [
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'abc'
      }),
      new UserWidgetModel({
        userId: userInfo.id,
        widgetId: 'def'
      })
    ]
    const baseWidgetsToGet = [
      new BaseWidgetModel({
        id: 'abc',
        position: 2
      }),
      new BaseWidgetModel({
        id: 'def',
        position: 1
      })
    ]

    const userWidgetQueryMethod = jest.spyOn(UserWidgetModel, 'query')
    const baseWidgetGetBatchMethod = jest.spyOn(BaseWidgetModel, 'getBatch')
      .mockImplementation(() => {
        return baseWidgetsToGet
      })
    getUserWidgetsByEnabledState
      .mockImplementation(() => {
        return userWidgetsToGet
      })

    const userWidgets = await getWidgets(userContext, userInfo.id, true)
    expect(userWidgetQueryMethod).not.toHaveBeenCalled()
    expect(getUserWidgetsByEnabledState)
      .toHaveBeenCalledWith(userContext, userInfo.id, true)
    expect(baseWidgetGetBatchMethod).toHaveBeenCalledWith(userContext, [
      { id: 'abc' }, { id: 'def' }])
    const sortedFullWidgets = [
      constructFullWidget(userWidgetsToGet[1], baseWidgetsToGet[1]),
      constructFullWidget(userWidgetsToGet[0], baseWidgetsToGet[0])
    ]
    expect(userWidgets).toEqual(sortedFullWidgets)
  })
})
