/* global expect jest describe it */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import tablesNames from '../../tables'
import { User, setUserActiveWidget } from '../user'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

describe('User tests', function () {
  it('getTable name to be implemented', () => {
    expect(User.getTableName()).toBe(tablesNames.users)
  })

  it('getFields to be implemented', () => {
    const expected = [
      'username',
      'email',
      'vcCurrent',
      'vcAllTime',
      'level',
      'heartsUntilNextLevel',
      'backgroundImage',
      'backgroundOption',
      'customImage',
      'backgroundColor',
      'activeWidget'
    ]

    expect(User.getFields().length).toBe(expected.length)
    expect(User.getFields()).toEqual(expect.arrayContaining(expected))
  })

  it('auto create id', () => {
    const user = new User(null)
    expect(user.id).not.toBe(null)
  })

  it('create with existing id', () => {
    const user = new User('some_bad_id')
    expect(user.id).toBe('some_bad_id')
  })

  it('deserialize to be implemented', () => {
    const user = User.deserialize({
      id: 'someid',
      username: 'test_username',
      email: 'test@tfac.com',
      vcCurrent: 4
    })

    expect(user instanceof User).toBe(true)
    expect(user.id).toBe('someid')
    expect(user.username).toBe('test_username')
    expect(user.email).toBe('test@tfac.com')
    expect(user.vcCurrent).toBe(4)
  })

  it('updates the active widget', () => {
    const database = setup()

    const userId = 'some-user-id'
    const widgetId = 'some-widget-id'

    database.pushDatabaseOperation(
      new DatabaseOperation(OperationType.UPDATE, (params) => {
        return {
          Attributes: {
            id: params.Key.id,
            activeWidget: params.ExpressionAttributeValues[':activeWidget']
          }
        }
      })
    )

    return setUserActiveWidget(userId, widgetId)
          .then(data => {
            expect(data).not.toBe(null)
            expect(data.id).toBe(userId)
            expect(data.activeWidget).toBe(widgetId)
          })
  })
})
