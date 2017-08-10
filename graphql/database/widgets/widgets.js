
import { sortBy } from 'lodash/collection'

import BaseWidgetModel from './widget/BaseWidgetModel'
import {
  getUserWidgets as getAllUserWidgets,
  getUserWidgetsByEnabledState,
  updateWidgetData,
  updateWidgetVisibility,
  updateWidgetEnabled,
  updateWidgetConfig
} from './userWidget/userWidget'

/**
  * Merge the user widget with the widget data to create an object
  * with all the widget information.
  * @param {Object<UserWidget>} userWidget
  * @param {Object<UserWidget>} widget
  * @return {Object<UserWidget>}  Returns an instance of UserWidget
  * with all the widget information.
  */
function getFullWidget (userWidget, widget) {
  return Object.assign({},
    userWidget,
    widget,
    {
      id: userWidget.widgetId,
      data: JSON.stringify(userWidget.data),
      config: JSON.stringify(userWidget.config),
      settings: JSON.stringify(widget.settings)
    }
  )
}

/**
 * Fetch the widgets for a user. The result includes the widget data
 * as well as the user-widget related data.
 * The user-widget data field gets serialized into a string.
 * @param {string} userId - The user id.
 * @return {Object[]}  Returns a list of object that with the widget and
 * the user data on the widget information.
 */

const getUserWidgets = async (userContext, userId, enabled) => {
  var userWidgets
  if (typeof enabled !== 'undefined') {
    userWidgets = await getUserWidgetsByEnabledState(userId, enabled)
  } else {
    userWidgets = await getAllUserWidgets(userId)
  }

  const keys = []
  const indexMapper = {}

  var widgetId
  for (var index in userWidgets) {
    widgetId = userWidgets[index].widgetId
    keys.push({
      id: widgetId
    })
    indexMapper[widgetId] = index
  }
  if (!keys || keys.length === 0) {
    return []
  }

  const widgets = await BaseWidgetModel.getBatch(userContext, keys)
  const sortedWidgets = sortBy(widgets, (obj) => obj.position)

  const result = []
  var userWidget
  for (var i in sortedWidgets) {
    widgetId = sortedWidgets[i].id
    if (indexMapper[widgetId]) {
      userWidget = userWidgets[indexMapper[widgetId]]
      result.push(getFullWidget(userWidget, widgets[i]))
    }
  }
  return result
}

/**
 * Update widget data.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} data - The new widget data.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateUserWidgetData = async (userContext, userId, widgetId, data) => {
  const parsedData = JSON.parse(data)
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetData(userId, widgetId, parsedData)
  return getFullWidget(userWidget, widget)
}

/**
 * Update widget visible state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} visible - The new visible state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
const updateUserWidgetVisibility = async (userContext, userId, widgetId, visible) => {
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetVisibility(userId, widgetId, visible)
  return getFullWidget(userWidget, widget)
}

/**
 * Update widget enabled state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} enabled - The new enabled state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
const updateUserWidgetEnabled = async (userContext, userId, widgetId, enabled) => {
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetEnabled(userId, widgetId, enabled)
  return getFullWidget(userWidget, widget)
}

/**
 * Update widget config.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateUserWidgetConfig = async (userContext, userId, widgetId, config) => {
  const parsedConfig = JSON.parse(config)
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetConfig(userId, widgetId, parsedConfig)
  return getFullWidget(userWidget, widget)
}

/**
 * Get all widgets.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const getAllWidgets = async (userContext) => {
  const widgets = await BaseWidgetModel.getAll(userContext)
  widgets.forEach((widget, i) => {
    widgets[i].widgetId = widgets[i].id
    widgets[i].settings = JSON.stringify(widgets[i].settings)
  })
  const sortedWidgets = sortBy(widgets, (obj) => obj.position)
  return sortedWidgets
}

export {
  getUserWidgets,
  updateUserWidgetData,
  updateUserWidgetVisibility,
  updateUserWidgetEnabled,
  updateUserWidgetConfig,
  getAllWidgets
}
