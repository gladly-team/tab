
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

  static get indexes () {
    return [{
      hashKey: 'referringUser',
      rangeKey: 'created',
      name: 'ReferralsByReferrer',
      type: 'global'
    }]
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
      get: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      indexPermissions: {
        ReferralsByReferrer: {
          // Note: we should avoid showing a user the user IDs (or other
          // details) of their recruited users.
          get: permissionAuthorizers.userIdMatchesHashKey
        }
      }
    }
  }
}

ReferralData.register()

export default ReferralData
