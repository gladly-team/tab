import moment from 'moment'
import UserModel from '../users/UserModel'
import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'

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
  const missionModel = await MissionModel.get(override, missionId)

  if (accepted) {
    await UserModel.update(userContext, {
      id: userId,
      currentMissionId: missionId,
    })
    // Move the user to acceptedSquadMembers
    const { acceptedSquadMembers } = missionModel
    acceptedSquadMembers.push(userId)
    const { pendingSquadMembersExisting } = missionModel
    const newPendingSquadMembersExisting = pendingSquadMembersExisting.filter(
      pendingUser => pendingUser !== userId
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
    await MissionModel.update(override, missionModelUpdate)
  } else {
    // Move the user to rejectedSquadMembers
    const { rejectedSquadMembers } = missionModel
    rejectedSquadMembers.push(userId)
    const { pendingSquadMembersExisting } = missionModel
    const newPendingSquadMembersExisting = pendingSquadMembersExisting.filter(
      pendingUser => pendingUser !== userId
    )
    await MissionModel.update(override, {
      id: missionId,
      rejectedSquadMembers,
      pendingSquadMembersExisting: newPendingSquadMembersExisting,
    })
  }

  await UserMissionModel.getOrCreate(override, {
    userId,
    missionId,
  })

  return {
    success: true,
  }
}

export default squadInviteResponse
