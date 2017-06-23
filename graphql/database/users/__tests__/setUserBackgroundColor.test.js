/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { setUserBackgroundColor, User } from '../user'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('set user background color', () => {
  const database = setup()
  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
  const color = '#FFF'

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.Key.id).toBe(userId)

      const bColor = params.ExpressionAttributeValues[':backgroundColor']
      expect(bColor).toBe(color)

      const option = params.ExpressionAttributeValues[':backgroundOption']
      expect(option).toBe(User.BACKGROUND_OPTION_COLOR)

      return {
        Attributes: {
          id: userId,
          backgroundColor: color,
          backgroundOption: User.BACKGROUND_OPTION_COLOR
        }
      }
    })
  )

  return setUserBackgroundColor(userId, color)
    .then(data => {
      expect(data.id).toBe(userId)
      expect(data.backgroundColor).toBe(color)
      expect(data.backgroundOption).toBe(User.BACKGROUND_OPTION_COLOR)
    })
})
