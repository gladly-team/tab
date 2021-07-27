import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { INVITED_USERS } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class InvitedUsers extends BaseModel {
  static get name() {
    return INVITED_USERS
  }

  static get hashKey() {
    return 'inviterId'
  }

  static get rangeKey() {
    return 'invitedEmail'
  }

  static get indexes() {
    return [
      {
        hashKey: 'inviterId',
        name: 'InvitesByInviter',
        type: 'global',
      },
      {
        hashKey: 'invitedEmail',
        name: 'InvitesByInvitedEmail',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.invitedUsers
  }

  static get schema() {
    return {
      inviterId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      invitedEmail: types
        .string()
        .required()
        .description(`the email address of a newly invited user`),
      invitedId: types
        .string()
        .description(
          `the invited user's' user id once they have successfully signed up`
        ),
      missionId: types
        .string()
        .description(
          `if a user is invited to a mission, then include the mission id`
        ),
    }
  }

  static get fieldDefaults() {
    return {}
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      query: () => true,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      indexPermissions: {
        InvitesByInviter: { get: permissionAuthorizers.userIdMatchesHashKey },
      },
    }
  }
}

InvitedUsers.register()

export default InvitedUsers
