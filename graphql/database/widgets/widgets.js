import Async from 'asyncawait/async'
import Await from 'asyncawait/await'

import {
  Widget,
  getWidget,
  getWidgets
} from './widget/baseWidget'

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

var getUserWidgets = Async(function (userId, enabled) {
  var userWidgets
  if (typeof enabled !== 'undefined') {
    userWidgets = Await(getUserWidgetsByEnabledState(userId, enabled))
  } else {
    userWidgets = Await(getAllUserWidgets(userId))
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

  if (!keys.length) { return [] }

  const widgets = Await(Widget.getBatch(keys))

  const result = []
  var userWidget
  for (var i in widgets) {
    widgetId = widgets[i].id
    userWidget = userWidgets[indexMapper[widgetId]]

    result.push(
          getFullWidget(userWidget, widgets[i]))
  }
  return result
})

/**
 * Update widget data.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} data - The new widget data.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
var updateUserWidgetData = Async(function (userId, widgetId, data) {
  const parsedData = JSON.parse(data)
  const widget = Await(getWidget(widgetId))
  const userWidget = Await(updateWidgetData(userId, widgetId, parsedData))
  return getFullWidget(userWidget, widget)
})

/**
 * Update widget visible state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} visible - The new visible state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
var updateUserWidgetVisibility = Async(function (userId, widgetId, visible) {
  const widget = Await(getWidget(widgetId))
  const userWidget = Await(updateWidgetVisibility(userId, widgetId, visible))
  return getFullWidget(userWidget, widget)
})

/**
 * Update widget enabled state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} enabled - The new enabled state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
var updateUserWidgetEnabled = Async(function (userId, widgetId, enabled) {
  const widget = Await(getWidget(widgetId))
  const userWidget = Await(updateWidgetEnabled(userId, widgetId, enabled))
  return getFullWidget(userWidget, widget)
})

/**
 * Update widget config.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
var updateUserWidgetConfig = Async(function (userId, widgetId, config) {
  const parsedConfig = JSON.parse(config)
  const widget = Await(getWidget(widgetId))
  const userWidget = Await(updateWidgetConfig(userId, widgetId, parsedConfig))
  return getFullWidget(userWidget, widget)
})

/**
 * Get all widgets.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
var getAllWidgets = Async(function () {
  const widgets = Await(getWidgets())
  for (var i = 0; i < widgets.length; i++) {
    widgets[i].widgetId = widgets[i].id
    widgets[i].settings = JSON.stringify(widgets[i].settings)
  }
  return widgets
})

export {
  getUserWidgets,
  updateUserWidgetData,
  updateUserWidgetVisibility,
  updateUserWidgetEnabled,
  updateUserWidgetConfig,
  getAllWidgets
}
