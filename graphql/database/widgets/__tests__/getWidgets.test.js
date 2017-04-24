import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { getWidgets, Widget } from '../widgets';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch user widgets', () => {

	const database = setup();

	const userWidgets = [
		{
			id: '1e0465b2-f1f1-42e2-9a27-94f4099f67bd',
			name: 'Bookmarks',
			type: 'bookmarks',
			icon: null,
		},
		{
			id: '034e6df1-5e1e-4784-a277-3b27c55b929e',
			name: 'Search',
			type: 'search',
			icon: null,
		},
		{
			id: '7db4b390-02bb-4958-b4bc-a5ba66939579',
			name: 'Clock',
			type: 'clock',
			icon: null,
		}
	];

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.QUERY, (params) => {
			return { Items: userWidgets};
		})
	);

	return getWidgets()
    .then(response => {
        expect(response).not.toBe(null);
    	expect(response instanceof Array).toBe(true);
    	expect(response.length).toBe(userWidgets.length);
    	for(var index in response) {
    		expect(response[index].id).toBe(userWidgets[index].id);
    	}
    });
});
