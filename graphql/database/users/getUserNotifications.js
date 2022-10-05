import getUserFeature from '../experiments/getUserFeature'
import logger from '../../utils/logger'
import { NOTIF_ONE_AND_HALF_MILLION } from '../experiments/experimentConstants'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

const getUserNotifications = async (userContext, user) => {
  let notifications = []
  try {
    const NOTIF_CODE = '1.5Mraised' // edit per custom notification
    const showNotif = await getUserFeature(
      userContext,
      user,
      NOTIF_ONE_AND_HALF_MILLION
    )
    notifications = [...(showNotif.variation ? [{ code: NOTIF_CODE }] : [])]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
