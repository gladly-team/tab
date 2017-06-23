/* global jest expect test */

import mockDatabase from '../../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils'
import { updateWidgetEnabled } from '../userWidget'

jest.mock('../../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('update user widget enabled', () => {
  const database = setup()

  const userId = 'some-user-id'
  const widgetId = 'some-widget-id'
  const enabled = true

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      const receivedState = params.ExpressionAttributeValues[':enabled']
      expect(receivedState).toBe(enabled)

      const receivedKey = params.Key
      expect(receivedKey.userId).toBe(userId)
      expect(receivedKey.widgetId).toBe(widgetId)

      return {
        Attributes: {
          userId: userId,
          widgetId: widgetId,
          enabled: enabled
        }
      }
    })
  )

  return updateWidgetEnabled(userId, widgetId, enabled)
    .then(userWidget => {
      expect(userWidget).not.toBe(null)
      expect(userWidget.userId).toBe(userId)
      expect(userWidget.widgetId).toBe(widgetId)
      expect(userWidget.enabled).toBe(enabled)
    })
})
