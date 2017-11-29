/* eslint-env jest */

import tableNames from '../../tables'
import UserTabsLogModel from '../UserTabsLogModel'
import {
  permissionAuthorizers
} from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('UserTabsLogModel', () => {
  it('implements the name property', () => {
    expect(UserTabsLogModel.name).toBe('UserTabsLog')
  })

  it('implements the hashKey property', () => {
    expect(UserTabsLogModel.hashKey).toBe('userId')
  })

  it('implements the tableName property', () => {
    expect(UserTabsLogModel.tableName).toBe(tableNames.userTabsLog)
  })

  it('has the correct get permission', () => {
    expect(UserTabsLogModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(UserTabsLogModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(UserTabsLogModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(UserTabsLogModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
