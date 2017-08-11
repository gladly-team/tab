
import BaseWidgetModel from './baseWidget/BaseWidgetModel'
import constructFullWidget from './constructFullWidget'
import updateWidgetData from './userWidget/updateWidgetData'
import updateWidgetConfig from './userWidget/updateWidgetConfig'
import updateWidgetEnabled from './userWidget/updateWidgetEnabled'
import updateWidgetVisibility from './userWidget/updateWidgetVisibility'

/**
 * Update widget data.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} data - The new widget data.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateUserWidgetData = async (userContext, userId, widgetId, data) => {
  const parsedData = JSON.parse(data)
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetData(userContext, userId, widgetId, parsedData)
  return constructFullWidget(userWidget, widget)
}

/**
 * Update widget visible state.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} visible - The new visible state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
const updateUserWidgetVisibility = async (userContext, userId, widgetId, visible) => {
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetVisibility(userContext, userId, widgetId, visible)
  return constructFullWidget(userWidget, widget)
}

/**
 * Update widget enabled state.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} enabled - The new enabled state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
const updateUserWidgetEnabled = async (userContext, userId, widgetId, enabled) => {
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetEnabled(userContext, userId, widgetId, enabled)
  return constructFullWidget(userWidget, widget)
}

/**
 * Update widget config.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateUserWidgetConfig = async (userContext, userId, widgetId, config) => {
  const parsedConfig = JSON.parse(config)
  const widget = await BaseWidgetModel.get(userContext, widgetId)
  const userWidget = await updateWidgetConfig(userContext, userId, widgetId, parsedConfig)
  return constructFullWidget(userWidget, widget)
}

export {
  updateUserWidgetData,
  updateUserWidgetVisibility,
  updateUserWidgetEnabled,
  updateUserWidgetConfig
}
