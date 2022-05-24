import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_REVENUE } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends DynamoDBModel
 */
class UserRevenue extends DynamoDBModel {
  static get name() {
    return USER_REVENUE
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.userRevenueLog
  }

  static get schema() {
    return {
      userId: types.string().required(),
      timestamp: types
        .string()
        .isoDate()
        .required(),
      revenue: types.number().required(),
      dfpAdvertiserId: types.string(),
      adUnitCode: types.string(),
      tabId: types.string().uuid(),
      adSize: types.string(),
      isV4: types.boolean(),
      causeId: types.string(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserRevenue.register()

export default UserRevenue
