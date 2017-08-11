
import UserWidgetModel from './UserWidgetModel'

/**
 * Update widget data.
  * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} data - The new widget data.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
const updateWidgetData = async (userContext, userId, widgetId, data) => {
  return UserWidgetModel.update(userContext, {
    userId: userId,
    widgetId: widgetId,
    data: data
  })
}

export default updateWidgetData
