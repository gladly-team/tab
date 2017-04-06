jest.mock('../../database');  

import { getUser, User } from '../user';

test('fetch user by id', () => {
	return getUser('45bbefbf-63d1-4d36-931e-212fbe2bc3d9')
    .then(user => {
        expect(user).not.toBe(null);
    	expect(user instanceof User).toBe(true);
    	expect(user.id).toBe('45bbefbf-63d1-4d36-931e-212fbe2bc3d9');
    	expect(user.username).toBe('raulchall');
    	expect(user.email).toBe('raul@tfac.com');
        expect(user.vcCurrent).toBe(100);
    });
});
