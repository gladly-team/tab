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
    const showUserSurvey2022Notif = await getUserFeature(
      userContext,
      user,
      'user-survey-2022-notification'
    )
    notifications = [
      ...(showUserSurvey2022Notif.variation
        ? [{ code: 'userSurvey2022' }]
        : []),
    ]
  } catch (e) {
    logger.error(e)
  }
  return notifications
}

export default getUserNotifications
