/* eslint-env jest */

import tableNames from '../../tables'
import UserRevenueModel from '../UserRevenueModel'
import {
  permissionAuthorizers
} from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('UserRevenueModel', () => {
  it('implements the name property', () => {
    expect(UserRevenueModel.name).toBe('UserRevenue')
  })

  it('implements the hashKey property', () => {
    expect(UserRevenueModel.hashKey).toBe('userId')
  })

  it('implements the rangeKey property', () => {
    expect(UserRevenueModel.rangeKey).toBe('timestamp')
  })

  it('implements the tableName property', () => {
    expect(UserRevenueModel.tableName).toBe(tableNames.userRevenueLog)
  })

  it('has the correct get permission', () => {
    expect(UserRevenueModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(UserRevenueModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(UserRevenueModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(UserRevenueModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
