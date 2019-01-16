/* eslint-env jest */

import {
  updateWidgetData,
  updateWidgetVisibility,
  updateWidgetEnabled,
  updateWidgetConfig,
} from '../updateWidget'
import updateUserWidgetData from '../userWidget/updateUserWidgetData'
import updateUserWidgetConfig from '../userWidget/updateUserWidgetConfig'
import updateUserWidgetEnabled from '../userWidget/updateUserWidgetEnabled'
import updateUserWidgetVisibility from '../userWidget/updateUserWidgetVisibility'
import UserWidgetModel from '../userWidget/UserWidgetModel'
import BaseWidgetModel from '../baseWidget/BaseWidgetModel'
import constructFullWidget from '../constructFullWidget'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../userWidget/updateUserWidgetData')
jest.mock('../userWidget/updateUserWidgetConfig')
jest.mock('../userWidget/updateUserWidgetEnabled')
jest.mock('../userWidget/updateUserWidgetVisibility')

const userContext = getMockUserContext()

// Create mock widgets to use in tests.
const userId = userContext.id
const widgetId = 'ab5082cc-151a-4a9a-9289-06906670fd4e'
const mockUserWidget = new UserWidgetModel({
  userId,
  widgetId,
  data: {
    foo: 'bar',
  },
  enabled: true,
})
const mockBaseWidget = new BaseWidgetModel({
  id: widgetId,
  name: 'Bookmarks',
  position: 1,
})
const fullWidget = constructFullWidget(mockUserWidget, mockBaseWidget)
jest.spyOn(BaseWidgetModel, 'get').mockImplementation(() => mockBaseWidget)

afterEach(() => {
  jest.clearAllMocks()
})

describe('update', () => {
  test('updateWidgetData', async () => {
    const newData = { foo: 'baz' }
    updateUserWidgetData.mockImplementation(() =>
      Object.assign(mockUserWidget, {
        data: newData,
      })
    )
    const returnedWidget = await updateWidgetData(
      userContext,
      userId,
      widgetId,
      JSON.stringify(newData)
    )
    expect(updateUserWidgetData).toHaveBeenCalledWith(
      userContext,
      userId,
      widgetId,
      newData
    )
    expect(returnedWidget).toEqual(
      Object.assign(fullWidget, {
        data: JSON.stringify(newData),
      })
    )
  })

  test('updateWidgetVisibility', async () => {
    updateUserWidgetVisibility.mockImplementation(() =>
      Object.assign(mockUserWidget, {
        visible: false,
      })
    )
    const returnedWidget = await updateWidgetVisibility(
      userContext,
      userId,
      widgetId,
      false
    )
    expect(updateUserWidgetVisibility).toHaveBeenCalledWith(
      userContext,
      userId,
      widgetId,
      false
    )
    expect(returnedWidget).toEqual(
      Object.assign(fullWidget, {
        visible: false,
      })
    )
  })

  test('updateWidgetEnabled', async () => {
    updateUserWidgetEnabled.mockImplementation(() =>
      Object.assign(mockUserWidget, {
        enabled: false,
      })
    )
    const returnedWidget = await updateWidgetEnabled(
      userContext,
      userId,
      widgetId,
      false
    )
    expect(updateUserWidgetEnabled).toHaveBeenCalledWith(
      userContext,
      userId,
      widgetId,
      false
    )
    expect(returnedWidget).toEqual(
      Object.assign(fullWidget, {
        enabled: false,
      })
    )
  })

  test('updateWidgetConfig', async () => {
    const newConfig = { foo: 'baz' }
    updateUserWidgetConfig.mockImplementation(() =>
      Object.assign(mockUserWidget, {
        config: newConfig,
      })
    )
    const returnedWidget = await updateWidgetConfig(
      userContext,
      userId,
      widgetId,
      JSON.stringify(newConfig)
    )
    expect(updateUserWidgetConfig).toHaveBeenCalledWith(
      userContext,
      userId,
      widgetId,
      newConfig
    )
    expect(returnedWidget).toEqual(
      Object.assign(fullWidget, {
        config: JSON.stringify(newConfig),
      })
    )
  })
})
