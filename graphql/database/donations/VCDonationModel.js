
import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { VC_DONATION } from '../constants'
import {
  permissionAuthorizers
} from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class VCDonation extends BaseModel {
  static get name () {
    return VC_DONATION
  }

  static get hashKey () {
    return 'userId'
  }

  static get tableName () {
    return tableNames.vcDonationLog
  }

  static get schema () {
    const self = this
    return {
      userId: types.string().required(),
      charityId: types.uuid(),
      vcDonated: types.number().integer()
        .default(self.fieldDefaults.vcDonated)
    }
  }

  static get fieldDefaults () {
    return {
      vcDonated: 0
    }
  }

  static get permissions () {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey
    }
  }
}

VCDonation.register()

export default VCDonation
