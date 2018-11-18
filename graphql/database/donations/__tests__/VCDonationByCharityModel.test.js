/* eslint-env jest */

import tableNames from '../../tables'
import VCDonationByCharityModel from '../VCDonationByCharityModel'

jest.mock('../../databaseClient')

describe('VCDonationByCharityModel', () => {
  it('implements the name property', () => {
    expect(VCDonationByCharityModel.name).toBe('VcDonationByCharity')
  })

  it('implements the hashKey property', () => {
    expect(VCDonationByCharityModel.hashKey).toBe('charityId')
  })

  it('implements the rangeKey property', () => {
    expect(VCDonationByCharityModel.rangeKey).toBe('timestamp')
  })

  it('implements the tableName property', () => {
    expect(VCDonationByCharityModel.tableName).toBe(tableNames.vcDonationByCharity)
  })

  it('has the correct get permission', () => {
    expect(VCDonationByCharityModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(VCDonationByCharityModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(VCDonationByCharityModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(VCDonationByCharityModel.permissions.create).toBeUndefined()
  })
})
