
import BaseWidgetModel from './baseWidget/BaseWidgetModel'
import UserWidgetModel from './userWidget/UserWidgetModel'
import buildFullWidget from './buildFullWidget'

/**
 * Get a widget.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @return {Promise<Array<Widget>>}  Returns a promise that resolves into
 * an array of Widgets.
 */
const getWidget = async (userContext, userId, widgetId) => {
  const userWidget = await UserWidgetModel.get(userContext, userId, widgetId)
  const baseWidget = await BaseWidgetModel.get(userContext, widgetId)
  return buildFullWidget(userWidget, baseWidget)
}

export default getWidget
