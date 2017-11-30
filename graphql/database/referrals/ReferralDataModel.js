
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { REFERRAL_DATA } from '../constants'
import {
  permissionAuthorizers
} from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class ReferralData extends BaseModel {
  static get name () {
    return REFERRAL_DATA
  }

  static get hashKey () {
    return 'userId'
  }

  static get tableName () {
    return tableNames.referralDataLog
  }

  static get schema () {
    return {
      userId: types.string().required(),
      // Allow null values:
      // https://github.com/hapijs/joi/issues/516#issuecomment-66849863
      referringUser: types.string().allow(null),
      referringChannel: types.string().allow(null)
    }
  }

  static get permissions () {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey
    }
  }
}

ReferralData.register()

export default ReferralData
