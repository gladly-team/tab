/* eslint-env jest */

import tableNames from '../../tables'
import UserSearchLogModel from '../UserSearchLogModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('UserSearchLogModel', () => {
  it('implements the name property', () => {
    expect(UserSearchLogModel.name).toBe('UserSearchLog')
  })

  it('implements the hashKey property', () => {
    expect(UserSearchLogModel.hashKey).toBe('userId')
  })

  it('implements the tableName property', () => {
    expect(UserSearchLogModel.tableName).toBe(tableNames.userSearchLog)
  })

  it('has the correct get permission', () => {
    expect(UserSearchLogModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(UserSearchLogModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(UserSearchLogModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(UserSearchLogModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
