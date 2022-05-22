import DynamoDBModel from '../base/DynamoDBModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { REFERRAL_LINK_CLICK_LOG } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends DynamoDBModel
 */
class ReferralLinkClickLog extends DynamoDBModel {
  static get name() {
    return REFERRAL_LINK_CLICK_LOG
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.referralLinkClickLog
  }

  static get schema() {
    return {
      userId: types.string().required(),
      timestamp: types
        .string()
        .isoDate()
        .required(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

ReferralLinkClickLog.register()

export default ReferralLinkClickLog
