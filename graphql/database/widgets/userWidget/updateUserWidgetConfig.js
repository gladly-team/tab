
import UserWidgetModel from './UserWidgetModel'

/**
 * Update widget data.
  * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {Object} config - The new widget config.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
export default async (userContext, userId, widgetId, config) => {
  return UserWidgetModel.update(userContext, {
    userId: userId,
    widgetId: widgetId,
    config: config
  })
}
