import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import UserMissionModel from './UserMissionModel'
import UserModel from '../users/UserModel'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Records a user's acknowledging a mission notification.
 *
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 * @param {string} action - What action the user took (MISSION_COMPLETE, MISSION_STARTED)
 */
const hasSeenCompletedMission = async (userContext, userId, missionId) => {
  // Get the mission model and modify it.
  await Promise.all([
    UserMissionModel.update(override, {
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
