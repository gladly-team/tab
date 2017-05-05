import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';
import tablesNames from '../../tables';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { getUserWidgets, Widget } from '../widgets';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch enabled user widgets with the widget information and serialized data', () => {

	const database = setup();
	const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9';
	const enabled = true;

	const userWidgets = [
		{
			userId: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
		    widgetId: '7db4b390-02bb-4958-b4bc-a5ba66939579',
		    enabled: true,
		    data: { clockFormat: 12 }
		}
	];

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.QUERY, (params) => {
			return { Items: userWidgets};
		})
	);

	const widgets = [
		{
			id: '7db4b390-02bb-4958-b4bc-a5ba66939579',
			name: 'Clock',
			type: 'clock',
			icon: null,
		}
	];

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.BATCHGET, (params) => {

			const keys = params.RequestItems[tablesNames.widgets].Keys;
			expect(keys.length).toBe(1);
			expect(keys[0].id).toBe('7db4b390-02bb-4958-b4bc-a5ba66939579');

			const response = {};
			response[tablesNames.widgets] = widgets;
			return { Responses: response};
		})
	);

	return getUserWidgets(userId, enabled)
    .then(response => {
        expect(response).not.toBe(null);
    	expect(response instanceof Array).toBe(true);
    	expect(response.length).toBe(1);
    	expect(response[0].id).toBe('7db4b390-02bb-4958-b4bc-a5ba66939579');
    	expect(response[0].data).toBe(JSON.stringify({ clockFormat: 12 }));
    });
});
