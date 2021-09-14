import UserMissionModel from './UserMissionModel'
import UserModel from '../users/UserModel'

/**
 * Records a user's acknowledging a mission notification.
 *
 * @param {string} userContext - The user's' context
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 */
const hasSeenCompletedMission = async (userContext, userId, missionId) => {
  // Get the mission model and modify it.
  await Promise.all([
    UserMissionModel.update(userContext, {
      userId,
      missionId,
      acknowledgedMissionComplete: true,
    }),
    UserModel.update(userContext, { id: userId, currentMissionId: null }),
  ])
  return {
    success: true,
  }
}

export default hasSeenCompletedMission
