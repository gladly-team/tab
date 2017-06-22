/* global jest expect test */

import mockDatabase from '../../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils'
import { updateWidgetData } from '../userWidget'

jest.mock('../../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('update user widget data', () => {
  const database = setup()

  const userId = 'some-user-id'
  const widgetId = 'some-widget-id'

  const newData = { key: 100 }

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      const receivedData = params.ExpressionAttributeValues[':data']
      expect(receivedData.key).toBe(newData.key)

      const receivedKey = params.Key
      expect(receivedKey.userId).toBe(userId)
      expect(receivedKey.widgetId).toBe(widgetId)

      return {
        Attributes: {
          userId: userId,
          widgetId: widgetId,
          data: newData
        }
      }
    })
  )

  return updateWidgetData(userId, widgetId, newData)
    .then(userWidget => {
      expect(userWidget).not.toBe(null)
      expect(userWidget.userId).toBe(userId)
      expect(userWidget.widgetId).toBe(widgetId)
      expect(userWidget.data.key).toBe(newData.key)
    })
})
