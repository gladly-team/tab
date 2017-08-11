
import BaseWidgetModel from './widget/BaseWidgetModel'
import UserWidgetModel from './userWidget/UserWidgetModel'
import getFullWidget from './getFullWidget'

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
  return getFullWidget(userWidget, baseWidget)
}

export default getWidget
