// import logger from '../../utils/logger'
// import getUserFeature from '../experiments/getUserFeature'
// import { USER_SURVEY_DECEMBER_2023 } from '../experiments/experimentConstants'

/**
 * Get data for notifications the user should see.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {Notifications[]} An array of notification data, or an empty
 *   array.
 */

// const getUserNotifications = async (userContext, user) => {
const getUserNotifications = async () => {
  const notifications = []
  // try {
  //   const notifFeature = await getUserFeature(
  //     userContext,
  //     user,
  //     USER_SURVEY_DECEMBER_2023
  //   )
  //   const enabled = notifFeature.variation !== 'None'
  //   notifications = [
  //     ...(enabled
  //       ? [
  //           {
  //             code: USER_SURVEY_DECEMBER_2023,
  //             variation: notifFeature.variation,
  //           },
  //         ]
  //       : []),
  //   ]
  // } catch (e) {
  //   logger.error(e)
  // }
  return notifications
}

export default getUserNotifications
