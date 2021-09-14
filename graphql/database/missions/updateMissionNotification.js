import UserMissionModel from './UserMissionModel'
import { MISSION_COMPLETE, MISSION_STARTED } from './constants'

/**
 * Records a user's acknowledging a mission notification.
 *
 * @param {string} userContext - The user's context.
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 * @param {string} action - What action the user took (MISSION_COMPLETE, MISSION_STARTED)
 */
const updateMissionNotification = async (
  userContext,
  userId,
  missionId,
  action
) => {
  // Get the mission model and modify it.

  switch (action) {
    case MISSION_COMPLETE:
      await UserMissionModel.update(userContext, {
        userId,
        missionId,
        acknowledgedMissionComplete: true,
      })
      break
    case MISSION_STARTED:
      await UserMissionModel.update(userContext, {
        userId,
        missionId,
        acknowledgedMissionStarted: true,
      })
      break
    default:
      return {
        success: false,
      }
  }

  return {
    success: true,
  }
}

export default updateMissionNotification
