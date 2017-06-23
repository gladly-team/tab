/* global jest expect test */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { setUserBackgroundDaily, User } from '../user'

jest.mock('../../database', () => {
  return mockDatabase
})

jest.mock('../../backgroundImages/backgroundImage', () => {
  return {
    getRandomImage: jest.fn(() => {
      return Promise.resolve({
        id: 'image-id',
        name: 'Mountain Lake',
        fileName: 'lake.jpg'
      })
    })
  }
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('set user background image to daily', () => {
  const database = setup()

  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.Key.id).toBe(userId)
      const bImage = params.ExpressionAttributeValues[':backgroundImage']
      expect(bImage.id).toBe('image-id')
      expect(bImage.name).toBe('Mountain Lake')
      expect(bImage.fileName).toBe('lake.jpg')

      const mode = params.ExpressionAttributeValues[':backgroundOption']
      expect(mode).toBe(User.BACKGROUND_OPTION_DAILY)

      return {
        Attributes: {
          id: userId,
          backgroundImage: {
            id: bImage.id,
            name: bImage.name,
            fileName: bImage.fileName
          },
          backgroundOption: 'daily'
        }
      }
    })
  )

  return setUserBackgroundDaily(userId)
    .then(data => {
      expect(data).not.toBe(null)
      expect(data.id).toBe(userId)
      expect(data.backgroundImage.id).toBe('image-id')
    })
})
