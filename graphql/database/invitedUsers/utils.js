/* eslint-disable import/prefer-default-export */
// limit how many users can be created
import moment from 'moment'
import sgMail from '@sendgrid/mail'
import xssFilters from 'xss-filters'
import InvitedUsersModel from './InvitedUsersModel'
import UserMissionModel from '../missions/UserMissionModel'
import UserModel from '../users/UserModel'
import {
  ADMIN_MANAGEMENT,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'
import { SENDGRID_API_KEY } from '../../config'
import {
  GENERAL_EMAIL_INVITE_TEMPLATE_ID,
  SQUAD_EMAIL_TEMPLATE_ID,
} from '../constants'

const INVITED = 'invited'
const REJECTED = 'rejected'

export const verifyAndSendInvite = async ({
  userContext,
  inviterId,
  inviteEmail,
  invitingUser,
  inviterName,
  inviterMessage,
  currentMissionId,
}) => {
  const override = getPermissionsOverride(ADMIN_MANAGEMENT)
  sgMail.setApiKey(SENDGRID_API_KEY)
  const [existingUserDocs, hasUserBeenInvitedRecently] = await Promise.all([
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
  const existingUser = existingUserDocs[0]
  if (existingUserDocs.length) {
    // for squads
    if (currentMissionId) {
      if (existingUser.currentMissionId) {
        return {
          existingUserEmail: inviteEmail,
          existingUserId: existingUser.id,
          existingUserName: existingUser.username,
          status: REJECTED,
        }
      }
      const { pendingMissionInvites } = existingUser
      pendingMissionInvites.push({
        missionId: currentMissionId,
        invitingUser: {
          userId: inviterId,
          name: inviterName,
        },
      })
      await Promise.all([
        UserModel.update(override, {
          id: existingUser.id,
          pendingMissionInvites,
        }),
        UserMissionModel.create(override, {
          userId: existingUser.id,
          missionId: currentMissionId,
        }),
      ])
      return {
        existingUserEmail: inviteEmail,
        existingUserId: existingUser.id,
        existingUserName: existingUser.username,
        status: INVITED,
      }
    }
    return { email: inviteEmail, error: 'user already exists' }
  }
  if (hasUserBeenInvitedRecently.length) {
    return { email: inviteEmail, error: 'user has been invited recently' }
  }
  const msg = {
    to: inviteEmail,
    from: invitingUser.email,
    templateId: currentMissionId
      ? SQUAD_EMAIL_TEMPLATE_ID
      : GENERAL_EMAIL_INVITE_TEMPLATE_ID,
    dynamicTemplateData: {
      name: inviterName,
      username: encodeURIComponent(invitingUser.username),
      personalMessage: inviterMessage,
      missionId: currentMissionId,
    },
    category: currentMissionId ? 'squadReferral' : 'referral',
    asm: {
      group_id: 3861,
      groups_to_display: [3861],
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
      missionId: currentMissionId,
    })
    return { email: inviteEmail }
  } catch (e) {
    return {
      email: inviteEmail,
      error: 'email sent, invitedUserDoc failed to create',
    }
  }
}
export const sanitize = string => xssFilters.inHTMLData(string)

export const getUserInvites = async (userContext, inviterId) => {
  const override = getPermissionsOverride(ADMIN_MANAGEMENT)
  const endTimeRoundedISO = moment().toISOString()
  const startTimeRoundedISO = moment(endTimeRoundedISO)
    .subtract(1, 'days')
    .toISOString()
  return Promise.all([
    UserModel.get(userContext, inviterId),
    InvitedUsersModel.query(override, inviterId)
      .usingIndex('InvitesByInviter')
      .where('created')
      .between(startTimeRoundedISO, endTimeRoundedISO)
      .execute(),
  ])
}
