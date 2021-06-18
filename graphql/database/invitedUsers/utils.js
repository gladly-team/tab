/* eslint-disable import/prefer-default-export */
// limit how many users can be created
import moment from 'moment'
import sgMail from '@sendgrid/mail'
import InvitedUsersModel from './InvitedUsersModel'
import UserModel from '../users/UserModel'
import {
  ADMIN_MANAGEMENT,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'

export const verifyAndSendInvite = async (
  userContext,
  inviterId,
  inviteEmail,
  invitingUser,
  inviterName,
  inviterMessage
) => {
  const override = getPermissionsOverride(ADMIN_MANAGEMENT)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const [doesUserAlreadyExist, hasUserBeenInvitedRecently] = await Promise.all([
    UserModel.query(override, inviteEmail)
      .usingIndex('UsersByEmail')
      .execute(),
    InvitedUsersModel.query(override, inviteEmail)
      .usingIndex('InvitesByInvitedEmail')
      .where('created')
      .gte(
        moment()
          .subtract(30, 'days')
          .toISOString()
      )
      .execute(),
  ])
  if (doesUserAlreadyExist.length) {
    return { email: inviteEmail, error: 'user already exists' }
  }
  if (hasUserBeenInvitedRecently.length) {
    return { email: inviteEmail, error: 'user has been invited recently' }
  }
  const msg = {
    to: inviteEmail,
    from: invitingUser.email,
    templateId: 'd-e974f14ae104424cb8237b234d485804',
    dynamicTemplateData: {
      name: inviterName,
      username: invitingUser.username,
      personalMessage: inviterMessage,
    },
  }
  try {
    await sgMail.send(msg)
  } catch (e) {
    return { email: inviteEmail, error: 'email failed to send' }
  }
  try {
    await InvitedUsersModel.create(userContext, {
      inviterId,
      invitedEmail: inviteEmail,
    })
    return { email: inviteEmail }
  } catch (e) {
    return {
      email: inviteEmail,
      error: 'email sent, invitedUserDoc failed to create',
    }
  }
}
