import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
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
      type: types.string().valid(VALID_LOG_TYPES).required(),
      timestamp: types.string().isoDate().required(),
      eventData: types.alternatives().try(...VALID_LOG_SCHEMAS), // todo, @jtan add smarter validation here
    }
  }

  static get permissions() {
    return {
      create: (user, _hashKey, _rangeKey, item) => {
        return user.id === item.userId
      },
    }
  }
}

UserEventLogModel.register()

export default UserEventLogModel
