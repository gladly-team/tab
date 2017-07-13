/* eslint-env jest */

import tablesNames from '../../../tables'
import { Widget } from '../baseWidget'
jest.mock('../../../database')

test('getTable name to be implemented', () => {
  expect(Widget.getTableName()).toBe(tablesNames.widgets)
})

test('getFields to be implemented', () => {
  const expected = [
    'position',
    'name',
    'type',
    'icon',
    'settings'
  ]

  expect(Widget.getFields().length).toBe(expected.length)
  expect(Widget.getFields()).toEqual(expect.arrayContaining(expected))
})

test('auto create id', () => {
  const widget = new Widget(null)
  expect(widget.id).not.toBe(null)
})

test('create with existing id', () => {
  const widget = new Widget('some_bad_id')
  expect(widget.id).toBe('some_bad_id')
})

test('deserialize to be implemented', () => {
  const widget = Widget.deserialize({
    id: 'someid',
    name: 'widget_name',
    type: 'widget_type',
    icon: 'some/cool/icon'
  })

  expect(widget instanceof Widget).toBe(true)
  expect(widget.id).toBe('someid')
  expect(widget.name).toBe('widget_name')
  expect(widget.type).toBe('widget_type')
  expect(widget.icon).toBe('some/cool/icon')
})

test('should sort by position', () => {
  var widgets = [
    {
      id: 'someid',
      name: 'widget_name',
      type: 'widget_type',
      icon: 'some/cool/icon'
    },
    {
      id: 'someid3',
      position: 3,
      name: 'widget_3',
      type: 'widget_type',
      icon: 'some/cool/icon'
    },
    {
      id: 'someid2',
      position: 2,
      name: 'widget_2',
      type: 'widget_type',
      icon: 'some/cool/icon'
    },
    {
      id: 'someid1',
      position: 1,
      name: 'widget_1',
      type: 'widget_type',
      icon: 'some/cool/icon'
    }
  ]

  Widget.sorted(widgets)
  expect(widgets[0].position).toBe(1)
  expect(widgets[1].position).toBe(2)
  expect(widgets[2].position).toBe(3)
  expect(widgets[3].id).toBe('someid')
})
