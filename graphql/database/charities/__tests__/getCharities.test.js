import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

import charities from '../../__mocks__/fixtures/charities';
import { getCharities, Charity } from '../charity';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch all categories', () => {

	const database = setup();

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.SCAN, (params) => {
			return { Items: charities };
		})
	);

	return getCharities()
    .then(response => {
        expect(response).not.toBe(null);
    	expect(response instanceof Array).toBe(true);
    	expect(response.length).toBe(charities.length);
    	for(var index in response) {
    		expect(response[index].id).toBe(charities[index].id);
    	}
    });
});
