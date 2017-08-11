
import UserWidgetModel from './UserWidgetModel'

/**
 * Update widget data.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} enabled - Whether or not the widget is enabled.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateWidgetEnabled = async (userContext, userId, widgetId, enabled) => {
  return UserWidgetModel.update(userContext, {
    userId: userId,
    widgetId: widgetId,
    enabled: enabled
  })
}

export default updateWidgetEnabled
