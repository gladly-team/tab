import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { getBackgroundImage, BackgroundImage } from '../backgroundImage';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('fetch background image by id', () => {

	const database = setup();

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.GET, (params) => {
			expect(params.Key.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');

			return { Item: {
					id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
					name: 'imageName',
					fileName: 'image.png'
				} 
			};
		})
	);

	return getBackgroundImage('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    .then(bImage => {
        expect(bImage).not.toBe(null);
    	expect(bImage instanceof BackgroundImage).toBe(true);
    	expect(bImage.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    	expect(bImage.name).toBe('imageName');
    	expect(bImage.fileName).toBe('image.png');
    });
});
