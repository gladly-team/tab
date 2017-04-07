import mockDatabase from '../../__mocks__/database';

jest.mock('../../database', () => {
	return mockDatabase;
});

import { updateUserVc, User } from '../user';

function setup() {
	mockDatabase.init();
	return mockDatabase;
}

test('update user vc by x', () => {

	const database = setup();

	return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 15)
    .then(data => {
        expect(data).not.toBe(null);
        expect(data.userId).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    });
});
