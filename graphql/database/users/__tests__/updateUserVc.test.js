import mockDatabase from '../../__mocks__/database';
import { DatabaseOperation, OperationType } from '../../../utils/test-utils';

jest.mock('../../database', () => {
	return mockDatabase;
});

jest.mock('../../userLevels/userLevel', () => {
	return {
		getNextLevelFor: jest.fn((level, vc) => {
			return Promise.resolve({
				id: 4,
				hearts: 400
			});
		})
	};
});

import { updateUserVc, User } from '../user';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('user update vc', () => {

	const database = setup();

	database.pushDatabaseOperation(
		new DatabaseOperation(OperationType.UPDATE, (params) => {
			return { 
				Attributes: {
					id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
					vcCurrent: 50, 
					vcAllTime: 190, 
					heartsUntilNextLevel: 10 
				}
			};
		})
	);

	return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 15)
    .then(data => {
        expect(data).not.toBe(null);
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
        expect(data.vcCurrent).toBe(50);
        expect(data.vcAllTime).toBe(190);
        expect(data.heartsUntilNextLevel).toBe(10);
    });
});

test('user level up', () => {

	const database = setup();

	const userAfterVcUpdated = new DatabaseOperation(OperationType.UPDATE, (params) => {
		return { 
			Attributes: {
				id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
				level: 2,
				vcCurrent: 50, 
				vcAllTime: 300, 
				heartsUntilNextLevel: 0 
			}
		};
	});

	const userUpdatedAfterLevelUpResolved = new DatabaseOperation(OperationType.UPDATE, (params) => {
		
		expect(params.ExpressionAttributeValues[':level']).toBe(3);
		expect(params.ExpressionAttributeValues[':nextLevelHearts']).toBe(100);

		return { 
			Attributes: {
				id: '45bbefbf-63d1-4d36-931e-212fbe2bc3d9',
				level: 3,
				vcCurrent: 50, 
				vcAllTime: 300, 
				heartsUntilNextLevel: 100 
			}
		};
	});

	database.pushDatabaseOperation(userAfterVcUpdated);
	database.pushDatabaseOperation(userUpdatedAfterLevelUpResolved);

	return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 1)
    .then(data => {
        expect(data).not.toBe(null);
        expect(data.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    });
});
