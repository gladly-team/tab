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

  it('has the correct get permission', () => {
    expect(User.permissions.get).toBe(
      permissionAuthorizers.usernameOrUserIdMatchesHashKey)
  })

  it('has the correct update permission', () => {
    expect(User.permissions.update).toBe(
      permissionAuthorizers.usernameOrUserIdMatchesHashKey)
  })

  it('has the correct getAll permission', () => {
    expect(User.permissions.getAll()).toBe(false)
  })

  it('allows create when user info matches item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(true)
  })

  it('does not allow create when user ID is different', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when user ID is different', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo+hi@bar.com',
      username: 'myName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })

  it('does not allow create when username is different', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      username: 'myName'
    }
    const item = {
      id: 'abc',
      email: 'foo@bar.com',
      username: 'myOtherName'
    }
    expect(User.permissions.create(userContext, null, null, item))
      .toBe(false)
  })
})
