import getUserFeature from '../experiments/getUserFeature'
import logger from '../../utils/logger'
import { COLLEGE_AMBASSADOR_2022_NOTIF } from '../experiments/experimentConstants'

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
      COLLEGE_AMBASSADOR_2022_NOTIF
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
