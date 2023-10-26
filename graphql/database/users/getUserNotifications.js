import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import getSfacActivityState from './getSfacActivityState'
import { SFAC_ACTIVITY_STATES } from '../constants'

import {
  SHFAC_NOTIFY_FULLPAGE_NOV,
  SFAC_NOTIFY_FULLPAGE_NOV,
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

  // TODO(spicer): Look into why this does not work with growthbook filter.
  if (user.tabs <= 20) {
    return notifications
  }

  const sfacActivityState = await getSfacActivityState(userContext, user)

  // SFAC_NOTIFY_FULLPAGE_NOV
  const signupDate = new Date(user.shopSignupTimestamp)
  const currentDate = new Date()
  const thirtyDaysAgo = new Date(currentDate - 30 * 24 * 60 * 60 * 1000) // 30 days in milliseconds

  // Show search full page if a user already has shop, and has not see a full page notification in the last 30 days.
  if (
    user.shopSignupTimestamp &&
    signupDate.getTime() < thirtyDaysAgo.getTime() &&
    sfacActivityState !== SFAC_ACTIVITY_STATES.ACTIVE
  ) {
    try {
      const notifFeature = await getUserFeature(
        userContext,
        user,
        SFAC_NOTIFY_FULLPAGE_NOV
      )

      notifications = [
        ...notifications,
        {
          code: SFAC_NOTIFY_FULLPAGE_NOV,
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
      SHFAC_NOTIFY_FULLPAGE_NOV
    )

    notifications = [
      ...notifications,
      {
        code: SHFAC_NOTIFY_FULLPAGE_NOV,
        variation: notifFeature.variation,
      },
    ]
  } catch (e) {
    logger.error(e)
  }

  return notifications
}

export default getUserNotifications
