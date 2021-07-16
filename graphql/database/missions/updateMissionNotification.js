import UserToMissionModel from './UserToMission'

/**
 * Records a user's closing the "Mission Completed" notification.
 *
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 */
const updateMissionNotification = async (userContext, userId, missionId) => {
  // Get the mission model and modify it.
  await UserToMissionModel.update(userContext, {
    missionId,
    userId,
    someField: true
  })

  return {
    success: true,
  }
}

export default updateMissionNotification
