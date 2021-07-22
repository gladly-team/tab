import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import UserMissionModel from './UserMissionModel'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Records a user's closing the "Mission Completed" notification.
 *
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 */
const updateMissionNotification = async (userId, missionId) => {
  // Get the mission model and modify it.

  await UserMissionModel.update(override, {
    userId,
    missionId,
    acknowledgedMissionComplete: true,
  })

  return {
    success: true,
  }
}

export default updateMissionNotification
