import moment from 'moment'
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_SEARCH_SETTINGS_LOG, VALID_SEARCH_ENGINES } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserSearchSettingsLogModel extends BaseModel {
  static get name() {
    return USER_SEARCH_SETTINGS_LOG
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.userSearchSettingsLog
  }

  static get schema() {
    const self = this
    return {
      userId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      previousEngine: types
        .string()
        .valid(VALID_SEARCH_ENGINES)
        .required()
        .description(`The search engine that the user was previously using.`),
      newEngine: types
        .string()
        .valid(VALID_SEARCH_ENGINES)
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      timestamp: types
        .string()
        .isoDate()
        .default(self.fieldDefaults.timestamp)
        .description(`time user prompted`)
        .required(),
    }
  }

  static get fieldDefaults() {
    return {
      timestamp: moment.utc().toISOString(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserSearchSettingsLogModel.register()

export default UserSearchSettingsLogModel
