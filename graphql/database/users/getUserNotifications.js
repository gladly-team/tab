import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import { NOTIF_SFAC_JAN_2023 } from '../experiments/experimentConstants'

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
    const notifVariation = await getUserFeature(
      userContext,
      user,
      NOTIF_SFAC_JAN_2023
    )
    const enabled = notifVariation !== 'None'
    const NOTIF_CODE = 'SFACDec2022v2'
    notifications = [
      ...(enabled
        ? [{ code: NOTIF_SFAC_JAN_2023, variation: notifVariation }]
        : []),
    ]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
