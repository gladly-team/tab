/* global jest expect test */

import tablesNames from '../../../tables'
import { UserWidget } from '../userWidget'

jest.mock('../../../database')

test('getTable name to be implemented', () => {
  expect(UserWidget.getTableName()).toBe(tablesNames.userWidgets)
})

test('getFields to be implemented', () => {
  const expected = [
    'userId',
    'widgetId',
    'enabled',
    'visible',
    'data',
    'config'
  ]

  expect(UserWidget.getFields().length).toBe(expected.length)
  expect(UserWidget.getFields()).toEqual(expect.arrayContaining(expected))
})

test('auto create id', () => {
  const userWidget = new UserWidget(null)
  expect(userWidget.id).not.toBe(null)
})

test('create with existing id', () => {
  const userWidget = new UserWidget('some_bad_id')
  expect(userWidget.id).toBe('some_bad_id')
})

test('deserialize to be implemented', () => {
  const userWidget = UserWidget.deserialize({
    userId: 'someUserid',
    widgetId: 'someWidgetid',
    enabled: true,
    visible: false,
    data: { field: 'value' }
  })

  expect(userWidget instanceof UserWidget).toBe(true)
  expect(userWidget.userId).toBe('someUserid')
  expect(userWidget.widgetId).toBe('someWidgetid')
  expect(userWidget.enabled).toBe(true)
  expect(userWidget.visible).toBe(false)
  expect(userWidget.data.field).toBe('value')
})
