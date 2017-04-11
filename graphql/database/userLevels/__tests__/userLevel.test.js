jest.mock('../../database');

import tablesNames from '../../tables';
import { UserLevel } from '../userLevel';

test('getTable name to be implemented', () => {
	expect(UserLevel.getTableName()).toBe(tablesNames.userLevels);
});

test('getFields to be implemented', () => {
	const expected = [
      'hearts'
    ];

	expect(UserLevel.getFields().length).toBe(expected.length);
    expect(UserLevel.getFields()).toEqual(expect.arrayContaining(expected));
});

test('auto create id', () => {
	const userLevel = new UserLevel(null);
	expect(userLevel.id).not.toBe(null);
});

test('create with existing id', () => {
	const userLevel = new UserLevel(2);
	expect(userLevel.id).toBe(2);
});

test('deserialize to be implemented', () => {
	const userLevel = UserLevel.deserialize({
		id: 1,
  		hearts: 200
	});

	expect(userLevel instanceof UserLevel ).toBe(true);
	expect(userLevel.id).toBe(1);
	expect(userLevel.hearts).toBe(200);
});

