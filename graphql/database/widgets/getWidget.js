
import BaseWidgetModel from './baseWidget/BaseWidgetModel'
import UserWidgetModel from './userWidget/UserWidgetModel'
import constructFullWidget from './constructFullWidget'

/**
 * Get a widget.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @return {Promise<Array<Widget>>}  Returns a promise that resolves into
 * an array of Widgets.
 */
const getWidget = async (userContext, userId, widgetId) => {
  try {
    const userWidget = await UserWidgetModel.get(userContext, userId, widgetId)
    const baseWidget = await BaseWidgetModel.get(userContext, widgetId)
    return constructFullWidget(userWidget, baseWidget)
  } catch (e) {
    throw e
  }
}

export default getWidget
