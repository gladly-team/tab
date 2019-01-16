/* eslint-env jest */

import tableNames from '../../../tables'
import UserWidgetModel from '../UserWidgetModel'
import { permissionAuthorizers } from '../../../../utils/authorization-helpers'

jest.mock('../../../databaseClient')

describe('UserWidgetModel', () => {
  it('implements the name property', () => {
    expect(UserWidgetModel.name).toBe('UserWidget')
  })

  it('implements the hashKey property', () => {
    expect(UserWidgetModel.hashKey).toBe('userId')
  })

  it('implements the rangeKey property', () => {
    expect(UserWidgetModel.rangeKey).toBe('widgetId')
  })

  it('implements the tableName property', () => {
    expect(UserWidgetModel.tableName).toBe(tableNames.userWidgets)
  })

  it('has the correct get permission', () => {
    expect(UserWidgetModel.permissions.get).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct getAll permission', () => {
    expect(UserWidgetModel.permissions.getAll()).toBe(false)
  })

  it('has the correct update permission', () => {
    expect(UserWidgetModel.permissions.update).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })

  it('has the correct create permission', () => {
    expect(UserWidgetModel.permissions.create).toBe(
      permissionAuthorizers.userIdMatchesHashKey
    )
  })
})
