/* eslint-env jest */

import tableNames from '../../tables'
import UserDataConsentModel from '../UserDataConsentModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

jest.mock('../../databaseClient')

describe('UserDataConsentModel', () => {
  it('implements the name property', () => {
    expect(UserDataConsentModel.name).toBe('UserDataConsent')
  })

  it('implements the hashKey property', () => {
    expect(UserDataConsentModel.hashKey).toBe('userId')
  })

  it('implements the rangeKey property', () => {
    expect(UserDataConsentModel.rangeKey).toBe('timestamp')
  })

  it('implements the tableName property', () => {
    expect(UserDataConsentModel.tableName).toBe(tableNames.userDataConsentLog)
  })

  it('has the correct get permission', () => {
    expect(UserDataConsentModel.permissions.get).toBeUndefined()
  })

  it('has the correct getAll permission', () => {
    expect(UserDataConsentModel.permissions.getAll).toBeUndefined()
  })

  it('has the correct update permission', () => {
    expect(UserDataConsentModel.permissions.update).toBeUndefined()
  })

  it('has the correct create permission', () => {
    expect(UserDataConsentModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
