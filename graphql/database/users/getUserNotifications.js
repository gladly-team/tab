import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import { SHFAC_NOTIFY_LAUNCH } from '../experiments/experimentConstants'

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
    await getUserFeature(userContext, user, SHFAC_NOTIFY_LAUNCH)

    notifications = [{ code: SHFAC_NOTIFY_LAUNCH, variation: 'Experiment' }]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
