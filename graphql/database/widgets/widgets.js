
import { sortBy } from 'lodash/collection'

import BaseWidgetModel from './widget/BaseWidgetModel'
import getFullWidget from './getFullWidget'
import updateWidgetData from './userWidget/updateWidgetData'
import updateWidgetConfig from './userWidget/updateWidgetConfig'
import updateWidgetVisibility from './userWidget/updateWidgetVisibility'
import {
  updateWidgetEnabled
} from './userWidget/userWidget'

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
  const userWidget = await updateWidgetData(userContext, userId, widgetId, parsedData)
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
  const userWidget = await updateWidgetVisibility(userContext, userId, widgetId, visible)
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
  const userWidget = await updateWidgetConfig(userContext, userId, widgetId, parsedConfig)
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
  updateUserWidgetData,
  updateUserWidgetVisibility,
  updateUserWidgetEnabled,
  updateUserWidgetConfig,
  getAllWidgets
}
