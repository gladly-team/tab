/* eslint-env jest */

import tableNames from '../../tables'
import UserLevelModel from '../UserLevelModel'

jest.mock('../../databaseClient')

describe('UserLevelModel', () => {
  it('implements the name property', () => {
    expect(UserLevelModel.name).toBe('UserLevel')
  })

  it('implements the hashKey property', () => {
    expect(UserLevelModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(UserLevelModel.tableName).toBe(tableNames.userLevels)
  })

  it('has the correct get permission', () => {
    expect(UserLevelModel.permissions.get()).toBe(true)
  })

  it('has the correct getAll permission', () => {
    expect(UserLevelModel.permissions.getAll()).toBe(true)
  })

  it('has the correct update permission', () => {
    expect(UserLevelModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(UserLevelModel.permissions.create).toBeUndefined()
  })
})
