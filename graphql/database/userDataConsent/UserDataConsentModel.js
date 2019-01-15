import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_DATA_CONSENT } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserDataConsent extends BaseModel {
  static get name() {
    return USER_DATA_CONSENT
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'timestamp'
  }

  static get tableName() {
    return tableNames.userDataConsentLog
  }

  static get schema() {
    return {
      userId: types.string().required(),
      timestamp: types
        .string()
        .isoDate()
        .required(),
      consentString: types.string().required(),
      consentCreated: types
        .string()
        .isoDate()
        .required(),
      consentLastUpdated: types
        .string()
        .isoDate()
        .required(),
      version: types.number(),
      vendorListVersion: types.number(),
      cmpId: types.number(),
      cmpVersion: types.number(),
      consentScreen: types.number(),
      allowedPurposeIds: types.array().required(),
      allowedVendorIds: types.array().required(),
      isGlobalConsent: types.boolean().required(),
    }
  }

  static get permissions() {
    return {
      create: permissionAuthorizers.userIdMatchesHashKey,
    }
  }
}

UserDataConsent.register()

export default UserDataConsent
