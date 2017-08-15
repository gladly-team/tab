
import { sortBy } from 'lodash/collection'
import BaseWidgetModel from './BaseWidgetModel'

/**
 * Get all widgets.
 * @param {object} userContext - The user authorizer object.
 * @return {Promise<BaseWidget[]>}  Returns a promise that resolves into
 * an array of Widgets.
 */
const getAllBaseWidgets = async (userContext) => {
  const widgets = await BaseWidgetModel.getAll(userContext)
  widgets.forEach((widget, i) => {
    widgets[i].widgetId = widgets[i].id
    widgets[i].settings = JSON.stringify(widgets[i].settings)
  })
  const sortedWidgets = sortBy(widgets, (obj) => obj.position)
  return sortedWidgets
}

export default getAllBaseWidgets
