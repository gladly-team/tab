import { nanoid } from 'nanoid'
import xssFilters from 'xss-filters'
import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import getCurrentUserMission from './getCurrentUserMission'
import { NODE_ENV } from '../../config'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} squadName - the name of the squad being created
 * @return {Promise<Object>}  A promise that resolves into an object containing a squad id
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
    squadName: xssFilters.inHTMLData(squadName.slice(0, 30)),
    acceptedSquadMembers: [userId],
  }
  const userMission = {
    missionId,
    userId,
  }
  // lower tab goal for end to end tests in test environment
  if (NODE_ENV === 'test') {
    newMission.tabGoal = 3
  }
  await Promise.all([
    MissionModel.create(override, newMission),
    UserMissionModel.create(override, userMission),
  ])
  await UserModel.update(userContext, {
    id: userId,
    currentMissionId: missionId,
  })
  const newlyCreatedMission = await getCurrentUserMission({
    currentMissionId: missionId,
    id: userId,
  })
  return { currentMission: newlyCreatedMission }
}
