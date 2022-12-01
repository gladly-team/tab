import logger from '../../utils/logger'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

const SHOW_CURRENT_NOTIF = true

const getUserNotifications = async () => {
  let notifications = []
  try {
    const NOTIF_CODE = 'SFACDec2022' // edit per custom notification
    notifications = [...(SHOW_CURRENT_NOTIF ? [{ code: NOTIF_CODE }] : [])]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
