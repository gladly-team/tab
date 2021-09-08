import moment from 'moment'
import UserModel from './UserModel'
import rewardReferringUser from './rewardReferringUser'
import logger from '../../utils/logger'
import InvitedUsersModel from '../invitedUsers/InvitedUsersModel'
import {
  ADMIN_MANAGEMENT,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import UserMissionModel from '../missions/UserMissionModel'
import MissionModel from '../missions/MissionModel'
/**
 * Log that a user's email is verified, using the trustworthy
 * user context to know that the email is truly verified. Then,
 * perform any other actions that occur when a user is
 * verified. Important: this function must be idempotent,
 * because it could be called multiple times.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logEmailVerified = async (userContext, userId) => {
  const returnedUser = await UserModel.update(userContext, {
    id: userId,
    emailVerified: userContext.emailVerified,
  })

  // If the user's email is verified, reward their
  // referring user. `rewardReferringUser` is idempotent
  // so it's okay that we might call it more than once.
  if (userContext.emailVerified) {
    try {
      await rewardReferringUser(userContext, userId)
      const override = getPermissionsOverride(ADMIN_MANAGEMENT)
      const originalInvitedUsers = await InvitedUsersModel.query(
        override,
        userContext.email
      )
        .usingIndex('InvitesByInvitedEmail')
        .execute()
      await Promise.all(
        originalInvitedUsers.map(invitedUserEntry =>
          InvitedUsersModel.update(override, {
            ...invitedUserEntry,
            invitedId: userId,
          })
        )
      )
      // if missionId, update Mission
      const { currentMissionId } = returnedUser
      if (currentMissionId) {
        // Move the user to acceptedSquadMembers
        try {
          const missionModel = await MissionModel.get(
            override,
            currentMissionId
          )
          const { acceptedSquadMembers } = missionModel
          if (!acceptedSquadMembers.includes(userId)) {
            acceptedSquadMembers.push(userId)
          }
          const { pendingSquadMembersEmailInvite } = missionModel
          const newPendingSquadMembersEmailInvite = pendingSquadMembersEmailInvite.filter(
            pendingUser => pendingUser !== userContext.email
          )
          const missionModelUpdate = {
            id: currentMissionId,
            acceptedSquadMembers,
            pendingSquadMembersEmailInvite: newPendingSquadMembersEmailInvite,
          }
          // start mission once second user joins
          if (missionModel.started === undefined) {
            missionModelUpdate.started = moment.utc().toISOString()
          }
          await Promise.all([
            MissionModel.update(override, missionModelUpdate),
            UserMissionModel.getOrCreate(override, {
              userId,
              missionId: currentMissionId,
            }),
          ])
        } catch (e) {
          logger.error(`could not add user ${userId} to mission`)
        }
      }
    } catch (e) {
      logger.error(
        new Error(`Could not reward referring user for user ID ${userId}.`)
      )
    }
  }

  return returnedUser
}

export default logEmailVerified
