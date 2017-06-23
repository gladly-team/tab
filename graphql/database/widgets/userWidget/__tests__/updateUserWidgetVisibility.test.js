/* global jest expect test */

import mockDatabase from '../../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils'
import { updateWidgetVisibility } from '../userWidget'

jest.mock('../../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('update user widget visibility', () => {
  const database = setup()

  const userId = 'some-user-id'
  const widgetId = 'some-widget-id'
  const visibility = true

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      const receivedState = params.ExpressionAttributeValues[':visible']
      expect(receivedState).toBe(visibility)

      const receivedKey = params.Key
      expect(receivedKey.userId).toBe(userId)
      expect(receivedKey.widgetId).toBe(widgetId)

      return {
        Attributes: {
          userId: userId,
          widgetId: widgetId,
          visible: visibility
        }
      }
    })
  )

  return updateWidgetVisibility(userId, widgetId, visibility)
    .then(userWidget => {
      expect(userWidget).not.toBe(null)
      expect(userWidget.userId).toBe(userId)
      expect(userWidget.widgetId).toBe(widgetId)
      expect(userWidget.visible).toBe(visibility)
    })
})
