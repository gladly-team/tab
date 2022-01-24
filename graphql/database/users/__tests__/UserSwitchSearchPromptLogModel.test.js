/* eslint-env jest */
import tableNames from '../../tables'
import UserSwitchSearchPromptLog from '../UserSwitchSearchPromptLogModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserSwitchSearchPromptLogModel', () => {
  it('implements the name property', () => {
    expect(UserSwitchSearchPromptLog.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserSwitchSearchPromptLog.hashKey).toBeDefined()
  })

  it('implements the rangeKey property', () => {
    expect(UserSwitchSearchPromptLog.rangeKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(UserSwitchSearchPromptLog.tableName).toBe(
      tableNames.userSwitchSearchPromptLog
    )
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(
      UserSwitchSearchPromptLog.permissions.create(userContext, 'abc', '123')
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
      UserSwitchSearchPromptLog.permissions.create(
        userContext,
        null,
        null,
        item
      )
    ).toBe(false)
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new UserSwitchSearchPromptLog({
        userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
        searchEnginePrompted: 'yahoo',
        switched: true,
      })
    )
    expect(item).toEqual({
      userId: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      searchEnginePrompted: 'yahoo',
      switched: true,
      timestamp: '2017-05-19T13:59:46.000Z',
    })
  })
})
