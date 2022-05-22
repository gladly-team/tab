import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_LEVEL } from '../constants'

/*
 * @extends DynamoDBModel
 */
class UserLevel extends DynamoDBModel {
  static get name() {
    return USER_LEVEL
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return tableNames.userLevels
  }

  static get schema() {
    return {
      id: types.number().integer(),
      // The number of Hearts required to reach this level.
      hearts: types.number().integer(),
    }
  }

  static get permissions() {
    return {
      get: () => true,
      getAll: () => true,
    }
  }
}

UserLevel.register()

export default UserLevel
