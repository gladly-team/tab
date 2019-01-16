import BaseWidgetModel from './baseWidget/BaseWidgetModel'
import constructFullWidget from './constructFullWidget'
import updateUserWidgetData from './userWidget/updateUserWidgetData'
import updateUserWidgetConfig from './userWidget/updateUserWidgetConfig'
import updateUserWidgetEnabled from './userWidget/updateUserWidgetEnabled'
import updateUserWidgetVisibility from './userWidget/updateUserWidgetVisibility'

/**
 * Update widget data.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {string} data - A JSON string of the new widget data.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
export const updateWidgetData = async (userContext, userId, widgetId, data) => {
  try {
    const parsedData = JSON.parse(data)
    const widget = await BaseWidgetModel.get(userContext, widgetId)
    const userWidget = await updateUserWidgetData(
      userContext,
      userId,
      widgetId,
      parsedData
    )
    return constructFullWidget(userWidget, widget)
  } catch (e) {
    throw e
  }
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
export const updateWidgetVisibility = async (
  userContext,
  userId,
  widgetId,
  visible
) => {
  try {
    const widget = await BaseWidgetModel.get(userContext, widgetId)
    const userWidget = await updateUserWidgetVisibility(
      userContext,
      userId,
      widgetId,
      visible
    )
    return constructFullWidget(userWidget, widget)
  } catch (e) {
    throw e
  }
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
export const updateWidgetEnabled = async (
  userContext,
  userId,
  widgetId,
  enabled
) => {
  try {
    const widget = await BaseWidgetModel.get(userContext, widgetId)
    const userWidget = await updateUserWidgetEnabled(
      userContext,
      userId,
      widgetId,
      enabled
    )
    return constructFullWidget(userWidget, widget)
  } catch (e) {
    throw e
  }
}

/**
 * Update widget config.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {string} config - A JSON string of the new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
export const updateWidgetConfig = async (
  userContext,
  userId,
  widgetId,
  config
) => {
  try {
    const parsedConfig = JSON.parse(config)
    const widget = await BaseWidgetModel.get(userContext, widgetId)
    const userWidget = await updateUserWidgetConfig(
      userContext,
      userId,
      widgetId,
      parsedConfig
    )
    return constructFullWidget(userWidget, widget)
  } catch (e) {
    throw e
  }
}
