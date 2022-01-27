/* eslint-env jest */
import tableNames from '../../tables'
import UserSearchSettingsLog from '../UserSearchSettingsLogModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserSearchSettingsLogModel', () => {
  it('implements the name property', () => {
    expect(UserSearchSettingsLog.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserSearchSettingsLog.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(UserSearchSettingsLog.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(UserSearchSettingsLog.tableName).toBe(
      tableNames.userSearchSettingsLog
    )
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(
      UserSearchSettingsLog.permissions.create(userContext, 'abc', '123')
    ).toBe(true)
  })

  it('does not allow create when the item is not provided', () => {
    const userContext = {
      id: 'abcd',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    const item = null
    expect(
      UserSearchSettingsLog.permissions.create(userContext, null, null, item)
    ).toBe(false)
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new UserSearchSettingsLog({
        userId: 'abcdefghijklmno',
        previousEngine: 'yahoo',
        newEngine: 'google',
      })
    )
    expect(item).toEqual({
      userId: 'abcdefghijklmno',
      previousEngine: 'yahoo',
      newEngine: 'google',
      timestamp: '2017-05-19T13:59:46.000Z',
    })
  })

  it('only allows valid search engines', () => {
    const invalidPreviousEngine = new UserSearchSettingsLog({
      userId: 'abcdefghijklmno',
      previousEngine: 'not-real-engine',
      newEngine: 'google',
    })
    expect(() =>
      UserSearchSettingsLog.validate(invalidPreviousEngine)
    ).toThrow()

    const invalidNewEngine = new UserSearchSettingsLog({
      userId: 'abcdefghijklmno',
      previousEngine: 'yahoo',
      newEngine: 'not-real-engine',
    })
    expect(() => UserSearchSettingsLog.validate(invalidNewEngine)).toThrow()
  })
})
