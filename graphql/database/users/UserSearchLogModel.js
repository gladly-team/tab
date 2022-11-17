import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_SEARCH_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import { VALID_SEARCH_ENGINES } from '../search/searchEngineData'

/*
 * @extends DynamoDBModel

 */
class UserSearchLog extends DynamoDBModel {
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
      timestamp: types.string().isoDate().required(),
      source: types.string(),
      searchEngine: types.string().valid(VALID_SEARCH_ENGINES),
      causeId: types.string(),
      isAnonymous: types.bool(),
      version: types.number(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.idMatchesHashKey,
      get: permissionAuthorizers.idMatchesHashKey,
    }
  }
}

UserSearchLog.register()

export default UserSearchLog
