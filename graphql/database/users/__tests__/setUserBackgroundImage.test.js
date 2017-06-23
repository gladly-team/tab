/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { setUserBackgroundImage } from '../user'

jest.mock('../../database', () => {
  return mockDatabase
})

jest.mock('../../backgroundImages/backgroundImage', () => {
  return {
    getBackgroundImage: jest.fn((imageId) => {
      return Promise.resolve({
        id: imageId,
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

test('user update background image', () => {
  const database = setup()

  const userId = '45bbefbf-63d1-4d36-931e-212fbe2bc3d9'
  const imageId = 'fb5082cc-151a-4a9a-9289-06906670fd4e'

  database.pushDatabaseOperation(
    new DatabaseOperation(OperationType.UPDATE, (params) => {
      expect(params.Key.id).toBe(userId)
      const bImage = params.ExpressionAttributeValues[':backgroundImage']
      expect(bImage.id).toBe(imageId)
      expect(bImage.name).toBe('Mountain Lake')
      expect(bImage.fileName).toBe('lake.jpg')
      return {
        Attributes: {
          id: userId,
          backgroundImage: {
            id: bImage.id,
            name: bImage.name,
            fileName: bImage.fileName
          }
        }
      }
    })
  )

  return setUserBackgroundImage(userId, imageId)
    .then(data => {
      expect(data).not.toBe(null)
      expect(data.id).toBe(userId)
      expect(data.backgroundImage.id).toBe(imageId)
    })
})
