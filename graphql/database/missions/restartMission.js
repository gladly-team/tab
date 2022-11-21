import { nanoid } from 'nanoid'
import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import getCurrentUserMission from './getCurrentUserMission'
import { E2E_MISSIONS_TEST_TAB_GOAL } from '../../config'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} squadName - the name of the squad being created
 * @return {Promise<Object>}  A promise that resolves into an object containing a squad id
 */

export default async (userContext, userId, missionId) => {
  const previousMission = await MissionModel.get(override, missionId)
  const user = await UserModel.get(userContext, userId)
  // user should not have been able to create a new mission if already in a mission
  if (user.currentMissionId) {
    throw new Error(
      'attempting to create a new squad while still in an ongoing missions'
    )
  }
  const newMissionId = nanoid(9)
  const otherTeamMembers = previousMission.acceptedSquadMembers.filter(
    (otherUsers) => otherUsers !== userId
  )
  const newMission = {
    id: newMissionId,
    squadName: previousMission.squadName,
    acceptedSquadMembers: [userId],
    pendingSquadMembersExisting: otherTeamMembers,
  }
  // lower tab goal for end to end tests in test environment
  if (E2E_MISSIONS_TEST_TAB_GOAL === 'true') {
    newMission.tabGoal = 3
  }
  await Promise.all([
    // create actual mission
    MissionModel.create(override, newMission),
    // update mission info for user recreating the mission
    UserMissionModel.create(userContext, {
      missionId: newMissionId,
      userId,
    }),
    UserModel.update(userContext, {
      id: userId,
      currentMissionId: newMissionId,
    }),
  ])
  // invite other users who accepted previous mission
  await Promise.all(
    otherTeamMembers.map(async (teamMemberId) => {
      const existingUser = await UserModel.get(override, teamMemberId)
      const { pendingMissionInvites } = existingUser
      pendingMissionInvites.push({
        missionId: newMissionId,
        invitingUser: {
          userId,
          name: user.username,
        },
      })
      return Promise.all([
        UserModel.update(override, {
          id: existingUser.id,
          pendingMissionInvites,
        }),
      ])
    })
  )
  const newlyCreatedMission = await getCurrentUserMission({
    currentMissionId: newMissionId,
    id: userId,
  })
  return { currentMission: newlyCreatedMission }
}
