import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { getBackgroundImages, BackgroundImage } from '../backgroundImage';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch all background Images', () => {

	const database = setup();

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.SCAN, (params) => {
			return { Items: [
				{id: 'image0', name: 'image0', fileName: 'image0.png'},
				{id: 'image1', name: 'image1', fileName: 'image1.png'},
				{id: 'image2', name: 'image2', fileName: 'image2.png'}
				]};
		})
	);

	return getBackgroundImages()
    .then(response => {
        expect(response).not.toBe(null);
    	expect(response instanceof Array).toBe(true);
    	expect(response.length).toBe(3);
    	for(var index in response) {
    		expect(response[index].id).toBe(`image${index}`);
    	}
    });
});
