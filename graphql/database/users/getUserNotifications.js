import getUserFeature from '../experiments/getUserFeature'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

const getUserNotifications = async (userContext, user) => {
  const showUserSurvey2022Notif = await getUserFeature(
    userContext,
    user,
    'user-survey-2022-notification'
  )
  return [
    ...(showUserSurvey2022Notif.variation ? [{ code: 'userSurvey2022' }] : []),
  ]
}

export default getUserNotifications
