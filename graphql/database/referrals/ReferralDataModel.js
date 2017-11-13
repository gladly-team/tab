
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
      referringUser: types.uuid()
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
