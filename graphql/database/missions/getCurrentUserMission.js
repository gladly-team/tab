import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import buildMissionReturnType from './utils'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Fetch current mission for user.
 * @return {Promise<Mission>}  A promise that resolves
 * into a mission.
 */

export default async ({ currentMissionId, id: userId }) => {
  // if no mission return
  console.log(userId, currentMissionId)
  if (currentMissionId !== undefined) {
    const [userMissionDocuments, missionDocument] = await Promise.all([
      UserMissionModel.query(override, currentMissionId).execute(),
      MissionModel.get(override, currentMissionId),
    ])
    return buildMissionReturnType(missionDocument, userMissionDocuments, userId)
  }
  return null
}
