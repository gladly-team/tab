/* global jest expect test */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { setUserBackgroundFromCustomUrl, User } from '../user'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('set user background from custom url', () => {

})

test('set user background color', () => {
  const database = setup()
  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
  const imageUrl = '/some/url'

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.Key.id).toBe(userId)

      const customImage = params.ExpressionAttributeValues[':customImage']
      expect(customImage).toBe(imageUrl)

      const option = params.ExpressionAttributeValues[':backgroundOption']
      expect(option).toBe(User.BACKGROUND_OPTION_CUSTOM)

      return {
        Attributes: {
          id: userId,
          customImage: imageUrl,
          backgroundOption: User.BACKGROUND_OPTION_CUSTOM
        }
      }
    })
  )

  return setUserBackgroundFromCustomUrl(userId, imageUrl)
    .then(data => {
      expect(data.id).toBe(userId)
      expect(data.customImage).toBe(imageUrl)
      expect(data.backgroundOption).toBe(User.BACKGROUND_OPTION_CUSTOM)
    })
})
