jest.mock('../../database');  

import { updateUserVc, User } from '../user';

test('update user vc by x', () => {
	return updateUserVc('45bbefbf-63d1-4d36-931e-212fbe2bc3d9', 15)
    .then(data => {
        expect(data).not.toBe(null);
        expect(data.userId).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    });
});
