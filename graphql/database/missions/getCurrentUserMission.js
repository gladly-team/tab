import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import { buildMissionReturnType } from './utils'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Fetch current mission for user.
 * @return {Promise<Mission>}  A promise that resolves
 * into a mission.
 */

// eslint-disable-next-line consistent-return
export default async ({ currentMissionId, id: userId }) => {
  // if no mission return
  if (currentMissionId !== undefined) {
    const [userMissionDocuments, missionDocument] = await Promise.all([
      UserMissionModel.query(override, currentMissionId).execute(),
      MissionModel.get(override, currentMissionId),
    ])
    return buildMissionReturnType(missionDocument, userMissionDocuments, userId)
  }
}
