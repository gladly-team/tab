import uniq from 'lodash/uniq'
import MissionModel from './MissionModel'
// import { verifyAndSendInvite } from '../invitedUsers/utils'
import {
  MISSIONS_OVERRIDE,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import {
  verifyAndSendInvite,
  sanitize,
  getUserInvites,
} from '../invitedUsers/utils'
import getCurrentUserMission from './getCurrentUserMission'
import UserModel from '../users/UserModel'
import getCause from '../cause/getCause'

const INVITED = 'invited'
/**
 * conditionally creates a new invited user and sends a sendgrid email if user has not already
 * been invited OR if inviting user has exceeded the max amount of invites in 24 hours
 * @param {object} userContext - The user authorizer object.
 * @param {string} inviterId - The user id.
 * @param {array} invitedEmails - email addresses to send
 * @param {string} inviterName - name to include in ivite email
 * @param {string} inviterMessage - optional personal message to include in email
 * @return {Promise<User>}  A promise that resolves into a invitedUser instance or an error.
 */
const createInvitedUsers = async (
  userContext,
  inviterId,
  invitedEmails,
  inviterName,
  inviterMessage
) => {
  try {
    // get users current mission
    const override = getPermissionsOverride(MISSIONS_OVERRIDE)
    // sanitize strings
    const sanitizedEmails = uniq(invitedEmails.map((email) => sanitize(email)))
    const sanitizedMessage = inviterMessage
      ? sanitize(inviterMessage)
      : undefined
    const santiziedInviterName = sanitize(inviterName)

    // handle invites
    const [invitingUser, userInvites] = await getUserInvites(
      userContext,
      inviterId
    )
    if (userInvites.length + sanitizedEmails.length > 50) {
      throw new Error('user is trying to invite too many people in 24 hours')
    }

    const currentMission = await MissionModel.get(
      override,
      invitingUser.currentMissionId
    )
    // get template id
    const user = await UserModel.get(userContext, inviterId)
    const cause = await getCause(user.causeId)
    const verifiedAndSentInvites = await Promise.all(
      sanitizedEmails.map((inviteEmail) =>
        verifyAndSendInvite({
          userContext,
          inviterId,
          inviteEmail,
          invitingUser,
          inviterName: santiziedInviterName,
          inviterMessage: sanitizedMessage,
          currentMissionId: currentMission.id,
          templateId: cause.squads.squadInviteTemplateId,
        })
      )
    )
    const sortedResults = verifiedAndSentInvites.reduce(
      (acum, item) => {
        if (item.existingUserId) {
          acum[
            item.status === INVITED
              ? 'existingUserInvited'
              : 'existingUserRejected'
          ].push(item.existingUserId)
        } else {
          acum[
            item.error ? 'failedEmailAddresses' : 'successfulEmailAddresses'
          ].push(item)
        }
        return acum
      },
      {
        successfulEmailAddresses: [],
        failedEmailAddresses: [],
        existingUserInvited: [],
        existingUserRejected: [],
      }
    )
    await MissionModel.update(override, {
      id: currentMission.id,
      pendingSquadMembersExisting: [
        ...currentMission.pendingSquadMembersExisting,
        ...sortedResults.existingUserInvited,
      ],
      pendingSquadMembersEmailInvite: [
        ...currentMission.pendingSquadMembersEmailInvite,
        ...sortedResults.successfulEmailAddresses.map((item) => item.email),
      ],
      rejectedSquadMembers: [
        ...currentMission.rejectedSquadMembers,
        ...sortedResults.existingUserRejected,
        ...sortedResults.failedEmailAddresses.map((item) => item.email),
      ],
    })
    const newlyCreatedMission = await getCurrentUserMission({
      id: inviterId,
      currentMissionId: currentMission.id,
    })
    return { currentMission: newlyCreatedMission }
  } catch (e) {
    throw e
  }
}

export default createInvitedUsers
