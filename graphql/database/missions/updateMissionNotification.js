import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import UserMissionModel from './UserMissionModel'
import { MISSION_COMPLETE, MISSION_STARTED } from './constants'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Records a user's acknowledging a mission notification.
 *
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 * @param {string} action - What action the user took (MISSION_COMPLETE, MISSION_STARTED)
 */
const updateMissionNotification = async (userId, missionId, action) => {
  // Get the mission model and modify it.

  switch (action) {
    case MISSION_COMPLETE:
      await UserMissionModel.update(override, {
        userId,
        missionId,
        acknowledgedMissionComplete: true,
      })
      break
    case MISSION_STARTED:
      await UserMissionModel.update(override, {
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
