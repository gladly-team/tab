
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
  var userWidget
  try {
    userWidget = await UserWidgetModel.update(userContext, {
      userId: userId,
      widgetId: widgetId,
      config: config
    })
  } catch (e) {
    // The item likely does not exist. This might happen when a
    // user modifies the config of a widget they've never used.
    // Try to create the widget.
    if (e.code === 'ConditionalCheckFailedException') {
      try {
        userWidget = await UserWidgetModel.create(userContext, {
          userId: userId,
          widgetId: widgetId,
          config: config
        })
      } catch (e) {
        throw e
      }
    } else {
      throw e
    }
  }
  return userWidget
}
