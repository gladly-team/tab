/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

// TODO: remove lint disable
// eslint-disable-next-line no-unused-vars
const getUserNotifications = (userContext, user) => {
  // TODO
  return [{ code: 'userSurvey2022' }]
}

export default getUserNotifications
