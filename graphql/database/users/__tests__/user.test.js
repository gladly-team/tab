jest.mock('../../database');  
const tablesNames = require('../../tables');

import { User } from '../user';

test('getTable name to be implemented', () => {
	expect(User.getTableName()).toBe(tablesNames.users);
});

test('getFields to be implemented', () => {
	const expected = [
      'username',
      'email',
      'vcCurrent',
      'vcAllTime',
      'level',
      'heartsUntilNextLevel'
    ];

	expect(User.getFields().length).toBe(expected.length);
    expect(User.getFields()).toEqual(expect.arrayContaining(expected));
});

test('auto create id', () => {
	const user = new User(null, 'test_name', 'test_username', 'test@tfac.com');
	expect(user.id).not.toBe(null);
});

test('create with existing id', () => {
	const user = new User('some_bad_id', 'test_name', 'test_username', 'test@tfac.com');
	expect(user.id).toBe('some_bad_id');
});

test('deserialize to be implemented', () => {
	const user = User.deserialize({
		id: 'someid',
  		username: 'test_username',
  		email: 'test@tfac.com',
  		vcCurrent: 4
	});

	expect(user instanceof User ).toBe(true);
	expect(user.id).toBe('someid');
	expect(user.username).toBe('test_username');
	expect(user.email).toBe('test@tfac.com');
	expect(user.vcCurrent).toBe(4);
});

