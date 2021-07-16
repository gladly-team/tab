import UserModel from '../users/UserModel'
import UserToMissionModel from './UserToMission'
import MissionModel from './Mission'
/**
 * Records a user's response to an invitation to join a mission.
 *
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {string} missionId - The mission's ID.
 * @param {boolean} accepted - Whether or not the user accepted the mission.
 */
const squadInviteResponse = async (userContext, userId, missionId, accepted) => {
  if (accepted) {
    await UserModel.update(userContext, {
      userId,
      currentMission: missionId
    })
  }

  UserToMissionModel.getOrCreate(userContext, {

  })

  // Get the mission model and modify it.
  MissionModel.update(userContext, {
    missionId,
  })

  return {
    success: true,
  }
}

export default squadInviteResponse
