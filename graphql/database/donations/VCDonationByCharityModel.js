import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { VC_DONATION_BY_CHARITY } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class VCDonationByCharity extends BaseModel {
  static get name() {
    return VC_DONATION_BY_CHARITY
  }

  static get hashKey() {
    return 'charityId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.vcDonationByCharity
  }

  static get schema() {
    const self = this
    return {
      charityId: types.uuid().required(),
      timestamp: types
        .string()
        .isoDate()
        .required()
        .description(
          `The datetime of the start of the hour (bucketed by hour)`
        ),
      vcDonated: types
        .number()
        .integer()
        .default(self.fieldDefaults.vcDonated)
        .description(`The total VC donated in this hour period.`),
    }
  }

  static get fieldDefaults() {
    return {
      vcDonated: 0,
    }
  }

  static get permissions() {
    // This table should not be directly modified by users.
    return {
      get: permissionAuthorizers.allowAll,
    }
  }
}

VCDonationByCharity.register()

export default VCDonationByCharity
