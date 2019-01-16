/* eslint-env jest */

import tableNames from '../../../tables'
import BaseWidgetModel from '../BaseWidgetModel'

jest.mock('../../../databaseClient')

describe('BaseWidgetModel', () => {
  it('implements the name property', () => {
    expect(BaseWidgetModel.name).toBe('BaseWidget')
  })

  it('implements the hashKey property', () => {
    expect(BaseWidgetModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(BaseWidgetModel.tableName).toBe(tableNames.widgets)
  })
})
