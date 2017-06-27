/* eslint-env jest */

import mockDatabase from '../../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../../utils/test-utils'
import { updateWidgetConfig } from '../userWidget'

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

  const newConfig = { field: 100 }

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      const receivedData = params.ExpressionAttributeValues[':config']
      expect(receivedData.field).toBe(newConfig.field)

      const receivedKey = params.Key
      expect(receivedKey.userId).toBe(userId)
      expect(receivedKey.widgetId).toBe(widgetId)

      return {
        Attributes: {
          userId: userId,
          widgetId: widgetId,
          config: newConfig
        }
      }
    })
  )

  return updateWidgetConfig(userId, widgetId, newConfig)
    .then(userWidget => {
      expect(userWidget).not.toBe(null)
      expect(userWidget.userId).toBe(userId)
      expect(userWidget.widgetId).toBe(widgetId)
      expect(userWidget.config.field).toBe(newConfig.field)
    })
})
