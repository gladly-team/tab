import moment from 'moment'
import UserModel from '../users/UserModel'
import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import getCurrentUserMission from './getCurrentUserMission'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)

/**
 * Records a user's response to an invitation to join a mission.
 *
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 * @param {boolean} accepted - Whether or not the user accepted the mission.
 */
const squadInviteResponse = async (
  userContext,
  userId,
  missionId,
  accepted
) => {
  const [missionModel, user] = await Promise.all([
    MissionModel.get(override, missionId),
    UserModel.get(userContext, userId),
  ])

  if (accepted) {
    // Move the user to acceptedSquadMembers
    const { acceptedSquadMembers } = missionModel
    acceptedSquadMembers.push(userId)
    const { pendingSquadMembersExisting } = missionModel
    const newPendingSquadMembersExisting = pendingSquadMembersExisting.filter(
      (pendingUser) => pendingUser !== userId
    )
    const missionModelUpdate = {
      id: missionId,
      acceptedSquadMembers,
      pendingSquadMembersExisting: newPendingSquadMembersExisting,
    }
    // start mission once second user joins
    if (missionModel.started === undefined) {
      missionModelUpdate.started = moment.utc().toISOString()
    }
    await Promise.all([
      MissionModel.update(override, missionModelUpdate),
      UserModel.update(userContext, {
        id: userId,
        currentMissionId: missionId,
        pendingMissionInvites: user.pendingMissionInvites.slice(1),
      }),
      UserMissionModel.getOrCreate(userContext, {
        userId,
        missionId,
        acknowledgedMissionStarted: true,
      }),
    ])
  } else {
    // Move the user to rejectedSquadMembers
    const { rejectedSquadMembers } = missionModel
    rejectedSquadMembers.push(userId)
    const { pendingSquadMembersExisting } = missionModel
    const newPendingSquadMembersExisting = pendingSquadMembersExisting.filter(
      (pendingUser) => pendingUser !== userId
    )
    await Promise.all([
      MissionModel.update(override, {
        id: missionId,
        rejectedSquadMembers,
        pendingSquadMembersExisting: newPendingSquadMembersExisting,
      }),
      UserModel.update(userContext, {
        id: userId,
        pendingMissionInvites: user.pendingMissionInvites.slice(1),
      }),
    ])
  }
  const updatedUserMission = await getCurrentUserMission({
    id: userId,
    currentMissionId: accepted ? missionId : undefined,
  })
  return { currentMission: updatedUserMission }
}

export default squadInviteResponse
