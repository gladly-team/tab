import { filter } from 'lodash/collection'
import UserWidgetModel from './UserWidgetModel'

/**
 * Fetch the widgets for a user by enabled state.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {boolean} enabled - Wether to fetch all enabled or disabled widgets.
 * @return {Promise<UserWidget[]>}  Returns a promise that resolves into a
 * list of user widgets.
 */
const getUserWidgetsByEnabledState = (userContext, userId, enabled) =>
  UserWidgetModel.query(userContext, userId)
    .execute()
    .then(widgets => {
      const result = filter(widgets, w => w.enabled === enabled)
      return result
    })

export default getUserWidgetsByEnabledState
