/* eslint-env jest */

import mockDatabase from '../../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils'
import { getUserWidget, UserWidget } from '../userWidget'

jest.mock('../../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('fetch the user widget by user id and widget id', () => {
  const database = setup()

  const userId = 'some-user-id'
  const widgetId = 'some-widget-id'

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.GET, (params) => {
      return {
        Item: {
          userId: userId,
          widgetId: widgetId,
          enabled: true,
          data: { key: 'value' }
        }
      }
    })
  )

  return getUserWidget(userId, widgetId)
    .then(widget => {
      expect(widget).not.toBe(null)
      expect(widget instanceof UserWidget).toBe(true)
      expect(widget.userId).toBe(userId)
      expect(widget.widgetId).toBe(widgetId)
      expect(widget.enabled).toBe(true)
      expect(widget.data.key).toBe('value')
    })
})
