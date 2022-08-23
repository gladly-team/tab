import getUserFeature from '../experiments/getUserFeature'
import logger from '../../utils/logger'

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
    const showCollegeAmbassadorNotif = await getUserFeature(
      userContext,
      user,
      'college-ambassador-2022-notif'
    )
    notifications = [
      ...(showCollegeAmbassadorNotif.variation
        ? [{ code: 'collegeAmbassador2022' }]
        : []),
    ]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
