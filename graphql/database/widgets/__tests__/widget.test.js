jest.mock('../../database');

import tablesNames from '../../tables';
import { Widget } from '../widgets';

test('getTable name to be implemented', () => {
	expect(Widget.getTableName()).toBe(tablesNames.widgets);
});

test('getFields to be implemented', () => {
	const expected = [
      'name',
      'type',
      'icon'
    ];

	expect(Widget.getFields().length).toBe(expected.length);
    expect(Widget.getFields()).toEqual(expect.arrayContaining(expected));
});

test('auto create id', () => {
	const widget = new Widget(null);
	expect(widget.id).not.toBe(null);
});

test('create with existing id', () => {
	const widget = new Widget('some_bad_id');
	expect(widget.id).toBe('some_bad_id');
});

test('deserialize to be implemented', () => {
	const widget = Widget.deserialize({
		id: 'someid',
  		name: 'widget_name',
  		type: 'widget_type',
  		icon: 'some/cool/icon'
	});

	expect(widget instanceof Widget ).toBe(true);
	expect(widget.id).toBe('someid');
	expect(widget.name).toBe('widget_name');
	expect(widget.type).toBe('widget_type');
	expect(widget.icon).toBe('some/cool/icon');
});

