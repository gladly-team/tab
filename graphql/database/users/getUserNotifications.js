import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import {
  SHFAC_NOTIFY_FULLPAGE_AUG,
  SFAC_NOTIFY_FULLPAGE_AUG,
} from '../experiments/experimentConstants'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

const getUserNotifications = async (userContext, user) => {
  let notifications = []

  // SFAC_NOTIFY_FULLPAGE_AUG
  const signupDate = new Date(user.shopSignupTimestamp)
  const currentDate = new Date()
  const thirtyDaysAgo = new Date(currentDate - 30 * 24 * 60 * 60 * 1000) // 30 days in milliseconds

  if (
    !user.shopSignupTimestamp ||
    signupDate.getTime() < thirtyDaysAgo.getTime()
  ) {
    try {
      const notifFeature = await getUserFeature(
        userContext,
        user,
        SFAC_NOTIFY_FULLPAGE_AUG
      )

      notifications = [
        ...notifications,
        {
          code: SFAC_NOTIFY_FULLPAGE_AUG,
          variation: notifFeature.variation,
        },
      ]

      return notifications
    } catch (e) {
      logger.error(e)
    }
  }

  // Only show the notification if the user has not signed up for a shop yet.
  if (user.shopSignupTimestamp) {
    return notifications
  }

  try {
    const notifFeature = await getUserFeature(
      userContext,
      user,
      SHFAC_NOTIFY_FULLPAGE_AUG
    )

    notifications = [
      ...notifications,
      {
        code: SHFAC_NOTIFY_FULLPAGE_AUG,
        variation: notifFeature.variation,
      },
    ]
  } catch (e) {
    logger.error(e)
  }

  return notifications
}

export default getUserNotifications
