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

  static get tableName() {
    return tableNames.invitedUsers
  }

  static get schema() {
    const self = this
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
      isSquadInvite: types
        .boolean()
        .default(self.fieldDefaults.isSquadInvite)
        .description(
          `whether the user is invited to a v4 squad or is a normal referral`
        ),
      status: types
        .string()
        .allow('pending', 'accepted')
        .default(self.fieldDefaults.status) // only set in app code
        .description(
          `the status of the invite. A user is pending and then can accept`
        ),
    }
  }

  static get fieldDefaults() {
    return {
      isSquadInvite: false,
      status: 'pending',
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

InvitedUsers.register()

export default InvitedUsers
