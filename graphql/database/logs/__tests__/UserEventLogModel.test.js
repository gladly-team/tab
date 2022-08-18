/* eslint-env jest */

import tableNames from '../../tables'
import UserEventLogModel from '../UserEventLogModel'
import { USER_EVENT_LOG } from '../../constants'
import { SFAC_EXTENSION_PROMPT_TYPE } from '../logTypes'

jest.mock('../../databaseClient')

describe('UserEventLogModel', () => {
  it('implements the name property', () => {
    expect(UserEventLogModel.name).toBe(USER_EVENT_LOG)
  })

  it('implements the hashKey property', () => {
    expect(UserEventLogModel.hashKey).toBe('id')
  })

  it('implements the tableName property', () => {
    expect(UserEventLogModel.tableName).toBe(tableNames.userEventLog)
  })

  it('allows create when the user context matches the item to create', () => {
    const userContext = {
      id: 'abc',
      email: 'foo@bar.com',
      emailVerified: true,
    }
    expect(
      UserEventLogModel.permissions.create(userContext, 'abc', '123')
    ).toBe(true)
  })

  it('only allows valid event types', () => {
    const model = new UserEventLogModel({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      userId: 'abcdefghijklmno',
      type: 'fake-type',
      timestamp: '2017-07-17T20:45:53Z',
      eventData: {
        browser: 'chrome',
        switched: true,
      },
    })
    expect(() => UserEventLogModel.validate(model)).toThrow()
  })

  it('only allows valid eventData types', () => {
    const model = new UserEventLogModel({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      userId: 'abcdefghijklmno',
      type: SFAC_EXTENSION_PROMPT_TYPE,
      timestamp: '2017-07-17T20:45:53Z',
      eventData: {
        browser: 'bing bong',
      },
    })
    expect(() => UserEventLogModel.validate(model)).toThrow()
  })

  it('allows valid event and eventData type', () => {
    const model = new UserEventLogModel({
      id: 'bb5082cc-151a-4a9a-9289-06906670fd4e',
      userId: 'abcdefghijklmno',
      type: SFAC_EXTENSION_PROMPT_TYPE,
      timestamp: '2017-07-17T20:45:53Z',
      eventData: {
        browser: 'chrome',
        switched: true,
      },
    })
    expect(() => UserEventLogModel.validate(model)).toThrow()
  })
})
