/* eslint-env jest */

import tableNames from '../../tables'
import VCDonationModel from '../VCDonationModel'
import {
  permissionAuthorizers
} from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('VCDonationModel', () => {
  it('implements the name property', () => {
    expect(VCDonationModel.name).toBe('VcDonation')
  })

  it('implements the hashKey property', () => {
    expect(VCDonationModel.hashKey).toBe('userId')
  })

  it('implements the tableName property', () => {
    expect(VCDonationModel.tableName).toBe(tableNames.vcDonationLog)
  })

  it('has the correct get permission', () => {
    expect(VCDonationModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(VCDonationModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(VCDonationModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(VCDonationModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
