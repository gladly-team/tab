import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_SEARCH_LOG, VALID_SEARCH_ENGINES } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserSearchLog extends BaseModel {
  static get name() {
    return USER_SEARCH_LOG
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.userSearchLog
  }

  static get schema() {
    return {
      userId: types.string().required(),
      timestamp: types
        .string()
        .isoDate()
        .required(),
      source: types.string(),
      searchEngine: types.string().valid(VALID_SEARCH_ENGINES),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
      get: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserSearchLog.register()

export default UserSearchLog
