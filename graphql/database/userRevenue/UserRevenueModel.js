
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_REVENUE } from '../constants'
import {
  permissionAuthorizers
} from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserRevenue extends BaseModel {
  static get name () {
    return USER_REVENUE
  }

  static get hashKey () {
    return 'userId'
  }

  static get rangeKey () {
    return 'timestamp'
  }

  static get tableName () {
    return tableNames.userRevenueLog
  }

  static get schema () {
    return {
      userId: types.string().required(),
      timestamp: types.string().isoDate().required(),
      vcDonated: types.number()
    }
  }

  static get permissions () {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey
    }
  }
}

UserRevenue.register()

export default UserRevenue
