import uniq from 'lodash/uniq'
import { verifyAndSendInvite, sanitize, getUserInvites } from './utils'
import UserModel from '../users/UserModel'
import getCause from '../cause/getCause'
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

    // get template id
    const user = await UserModel.get(userContext, inviterId)
    const cause = await getCause(user.causeId)
    const verifiedAndSentEmails = await Promise.all(
      sanitizedEmails.map((inviteEmail) =>
        verifyAndSendInvite({
          userContext,
          inviterId,
          inviteEmail,
          invitingUser,
          inviterName: santiziedInviterName,
          inviterMessage: sanitizedMessage,
          templateId: cause.sharing.sendgridEmailTemplateId,
          templateData: {
            ...cause.sharing.email,
            landingPagePath: cause.landingPagePath,
            cause: cause.name,
          },
        })
      )
    )
    const sortedResults = verifiedAndSentEmails.reduce(
      (acum, item) => {
        acum[
          item.error ? 'failedEmailAddresses' : 'successfulEmailAddresses'
        ].push(item)
        return acum
      },
      {
        successfulEmailAddresses: [],
        failedEmailAddresses: [],
      }
    )
    return sortedResults
  } catch (e) {
    throw e
  }
}

export default createInvitedUsers
