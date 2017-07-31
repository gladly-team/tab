/* eslint-env jest */

import tableNames from '../../tables'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import User from '../UserModel'

jest.mock('../../databaseClient')

describe('UserModel', () => {
  it('implements the name property', () => {
    expect(User.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(User.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(User.tableName).toBe(tableNames['users'])
  })

  it('has the correct permissions', () => {
    expect(User.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey)
    expect(User.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey)
    expect(User.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey)
    expect(User.permissions.getAll()).toBe(false)
  })
})
