import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { getWidget, Widget } from '../widgets';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch widget by id', () => {

	const database = setup();

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.GET, (params) => {
			return { Item: {
				id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
				name: 'Bookmarks',
				type: 'bookmarks',
				icon: null,
			} };
		})
	);

	return getWidget('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    .then(widget => {
        expect(widget).not.toBe(null);
    	expect(widget instanceof Widget).toBe(true);
    	expect(widget.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    	expect(widget.name).toBe('Bookmarks');
    	expect(widget.type).toBe('bookmarks');
        expect(widget.icon).toBe(null);
    });
});
