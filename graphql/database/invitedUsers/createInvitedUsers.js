import moment from 'moment'
import uniq from 'lodash/uniq'
import xssFilters from 'xss-filters'
import InvitedUsersModel from './InvitedUsersModel'
import UserModel from '../users/UserModel'
import { verifyAndSendInvite } from './utils'
/**
 * conditionally creates a new invited user and sends a sendgrid email if user has not already
 * been invited OR if inviting user has exceeded the max amount of invites in 24 hours
 * @param {object} userContext - The user authorizer object.
 * @param {string} inviterId - The user id.
 * @param {any} invitedEmails - A UUID for the charity
 * @param {object} inviterName - options to update impact record, include logImpact, claimPendingUserReferralImpact, confirmImpact
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
    console.log(inviterId)
    const endTimeRoundedISO = moment()
      .startOf('hour')
      .toISOString()
    const startTimeRoundedISO = moment(endTimeRoundedISO)
      .subtract(30, 'days')
      .endOf('hour')
      .toISOString()
    const sanitizedEmails = uniq(
      invitedEmails.map(email => xssFilters.inHTMLData(email))
    )
    const [invitingUser, userInvites] = await Promise.all([
      UserModel.get(userContext, inviterId),
      InvitedUsersModel.query(userContext, inviterId)
        .usingIndex('InvitesByInviter')
        .where('created')
        .between(startTimeRoundedISO, endTimeRoundedISO)
        .execute(),
    ])
    if (userInvites.length + sanitizedEmails.length > 50) {
      throw new Error('user is trying to invite too many people in 24 hours')
    }
    const sanitizedMessage = xssFilters.inHTMLData(inviterMessage)
    const verifiedAndSentEmails = await Promise.all(
      sanitizedEmails.map(inviteEmail =>
        verifyAndSendInvite(
          userContext,
          inviterId,
          inviteEmail,
          invitingUser,
          inviterName,
          sanitizedMessage
        )
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
    console.log(e, 'whats my error')
    throw e
  }
}

export default createInvitedUsers
