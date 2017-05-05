import mockDatabase from '../../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils';
import tablesNames from '../../../tables';

jest.mock('../../../database', () => {
	return mockDatabase;
});

import { getUserWidgetsByEnabledState, Widget } from '../userWidget';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch enabled user widgets ', () => {

	const database = setup();

	const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9';
	const enabled = true;

	const userWidgets = [
		{
			userId: userId,
		    widgetId: '1e0465b2-f1f1-42e2-9a27-94f4099f67bd',
		    enabled: false,
		    data: { bookmarks: [] }
		},
		{
			userId: userId,
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

	return getUserWidgetsByEnabledState(userId, enabled)
    .then(response => {
        expect(response).not.toBe(null);
    	expect(response instanceof Array).toBe(true);
    	expect(response.length).toBe(1);
    });
});
