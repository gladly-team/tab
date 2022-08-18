import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { permissionAuthorizers } from '../../utils/authorization-helpers'
import { VALID_LOG_SCHEMAS, VALID_LOG_TYPES } from './logTypes'
import { USER_EVENT_LOG } from '../constants'

/*
 * @extends DynamoDBModel
 */
class UserEventLogModel extends DynamoDBModel {
  static get name() {
    return USER_EVENT_LOG
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return tableNames.userEventLog
  }

  static get schema() {
    return {
      id: types.uuid(),
      userId: types.string().required(),
      type: types
        .string()
        .valid(VALID_LOG_TYPES)
        .required(),
      timestamp: types
        .string()
        .isoDate()
        .required(),
      eventData: types.object().valid(VALID_LOG_SCHEMAS),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserEventLogModel.register()

export default UserEventLogModel
