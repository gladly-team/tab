import { nanoid } from 'nanoid'
import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**

 * into a mission id.
 */

export default async (userContext, userId, squadName) => {
  const user = await UserModel.get(userContext, userId)
  // user should not have been able to create a new mission
  if (user.currentMissionId) {
    throw new Error(
      'attempting to create a new squad while still in an ongoing missions'
    )
  }
  const missionId = nanoid(9)
  const newMission = {
    id: missionId,
    squadName,
    acceptedSquadMembers: [userId],
  }
  const userMission = {
    missionId,
    userId,
  }
  await Promise.all([
    MissionModel.create(override, newMission),
    UserMissionModel.create(override, userMission),
  ])
  await UserModel.update(userContext, {
    id: userId,
    currentMissionId: missionId,
  })
  return { squadId: missionId }
}
