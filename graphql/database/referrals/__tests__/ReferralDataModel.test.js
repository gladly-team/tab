/* eslint-env jest */

import tableNames from '../../tables'
import ReferralDataModel from '../ReferralDataModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('ReferralDataModel', () => {
  it('implements the name property', () => {
    expect(ReferralDataModel.name).toBe('ReferralData')
  })

  it('implements the hashKey property', () => {
    expect(ReferralDataModel.hashKey).toBe('userId')
  })

  it('implements the tableName property', () => {
    expect(ReferralDataModel.tableName).toBe(tableNames.referralDataLog)
  })

  it('has the correct get permission', () => {
    expect(ReferralDataModel.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(ReferralDataModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(ReferralDataModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(ReferralDataModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct indexPermissions permissions for ReferralsByReferrer', () => {
    expect(
      ReferralDataModel.permissions.indexPermissions.ReferralsByReferrer.get
    ).toBe(permissionAuthorizers.userIdMatchesHashKey)
    expect(
      ReferralDataModel.permissions.indexPermissions.ReferralsByReferrer.getAll
    ).toBeUndefined()
    expect(
      ReferralDataModel.permissions.indexPermissions.ReferralsByReferrer.create
    ).toBeUndefined()
    expect(
      ReferralDataModel.permissions.indexPermissions.ReferralsByReferrer.update
    ).toBeUndefined()
  })
})
