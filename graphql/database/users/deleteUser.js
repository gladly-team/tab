import { v4 as uuid } from 'uuid'
import moment from 'moment'
import UserModel from './UserModel'
import UserWidgetModel from '../widgets/userWidget/UserWidgetModel'
import getWidgets from '../widgets/getWidgets'

/**
 * Delete all personally identifiable information, sensitive, and potentially sensitive user data.
 * Requires the user to have authed in the last 5 minutes.
 *
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 */
const deleteUser = async (userContext, userId) => {
  if (
    !('authTime' in userContext) ||
    moment.utc().diff(moment.unix(userContext.authTime), 'seconds') > 300
  ) {
    throw new Error(
      'User must have authed in the last 5 minutes to perform this operation.'
    )
  }

  try {
    const deletedUserId = uuid()

    // Cleanup Widget Data
    const widgets = await getWidgets(userContext, userId)

    await Promise.all(
      widgets.map(async (widget) => {
        await UserWidgetModel.update(userContext, {
          userId,
          widgetId: widget.widgetId,
          enabled: false,
          data: {},
          config: {},
        })
      })
    )

    // Scrub User Data
    await UserModel.update(userContext, {
      id: userId,
      email: `deleted-${deletedUserId}@example.com`,
      username: `deleted-${deletedUserId}`,
      backgroundImage: UserModel.fieldDefaults.backgroundImage(),
      deleted: true,
    })
  } catch (e) {
    throw e
  }
  return {
    success: true,
  }
}

export default deleteUser
